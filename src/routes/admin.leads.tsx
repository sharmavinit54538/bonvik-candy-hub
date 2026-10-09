import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Plus,
  Trash2,
  RefreshCw,
  LogOut,
  UploadCloud,
  Radio,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { useLeadStore } from "@/lib/leads/store";
import { leadStorage } from "@/lib/leads/storage";
import type { Lead, LeadSource, LeadStatus, LeadPriority } from "@/lib/leads/types";
import { LeadStats } from "@/components/leads/LeadStats";
import { LeadsChart } from "@/components/leads/LeadsChart";
import { LeadFilters, type LeadFilterValue } from "@/components/leads/LeadFilters";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadDrawer } from "@/components/leads/LeadDrawer";
import { LeadForm, type LeadFormValues } from "@/components/leads/LeadForm";
import { downloadCsv, leadsToCsv } from "@/lib/leads/export";
import {
  supabase,
  type AuthChangeEvent,
  type Session,
  type RealtimePostgresChangesPayload,
} from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Lead Management — Bonvik Foods Admin" },
      {
        name: "description",
        content: "Unified lead and partner application CRM for the Bonvik Foods sales team.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  const navigate = useNavigate();
  const { leads, fetchLeads, hydrated, loading, error, addLead, clearAll, importLegacyLeads } =
    useLeadStore();

  const [authChecked, setAuthChecked] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [filter, setFilter] = useState<LeadFilterValue>({
    q: "",
    status: "All",
    priority: "All",
    source: "All",
    dateRange: "All",
  });

  const [active, setActive] = useState<Lead | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [hasLegacy, setHasLegacy] = useState(false);
  const [importing, setImporting] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);

  // 1. Auth Protection Check
  const checkAdminAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        navigate({ to: "/admin/login" });
        return;
      }

      const user = session.user;
      setCurrentUserEmail(user.email ?? null);

      const hasMetadataRole =
        user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin";

      if (hasMetadataRole) {
        setAuthChecked(true);
        return;
      }

      // Query admin_users table
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (adminRow) {
        setAuthChecked(true);
        return;
      }

      // Not an admin
      console.warn("[AdminLeads] User is not authorized as admin:", user.id);
      await supabase.auth.signOut();
      toast.error("Access denied. Admin credentials required.");
      navigate({ to: "/admin/login" });
    } catch (err) {
      console.error("[AdminLeads] Auth check error:", err);
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  useEffect(() => {
    checkAdminAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!session) {
        navigate({ to: "/admin/login" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminAuth, navigate]);

  // 2. Check local legacy storage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLegacy(leadStorage.hasLegacyLeads());
    }
  }, []);

  // 3. Initial Fetch Leads
  useEffect(() => {
    if (authChecked) {
      fetchLeads();
    }
  }, [authChecked, fetchLeads]);

  // 4. Supabase Realtime Subscription & Polling Fallback
  useEffect(() => {
    if (!authChecked) return;

    // Realtime channel
    const channel = supabase
      .channel("crm-leads-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log("[Realtime] leads change detected:", payload.eventType);
          if (payload.eventType === "INSERT") {
            toast.info("🍬 New contact lead received!", {
              description: (payload.new as any)?.name,
            });
          }
          fetchLeads();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partner_applications" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log("[Realtime] partner_applications change detected:", payload.eventType);
          if (payload.eventType === "INSERT") {
            toast.info("🤝 New partner application received!", {
              description: (payload.new as any)?.business_name,
            });
          }
          fetchLeads();
        },
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          setRealtimeActive(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setRealtimeActive(false);
        }
      });

    // Fallback polling every 30 seconds
    const interval = setInterval(() => {
      fetchLeads();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [authChecked, fetchLeads]);

  // 5. Date-range and text filtering
  const filtered = useMemo(() => {
    const now = new Date().getTime();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTime = startOfToday.getTime();

    const sevenDaysAgoTime = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgoTime = now - 30 * 24 * 60 * 60 * 1000;

    return leads.filter((l) => {
      // Date filter
      if (filter.dateRange !== "All") {
        const leadTime = new Date(l.createdAt).getTime();
        if (filter.dateRange === "Today" && leadTime < startOfTodayTime) return false;
        if (filter.dateRange === "7 days" && leadTime < sevenDaysAgoTime) return false;
        if (filter.dateRange === "30 days" && leadTime < thirtyDaysAgoTime) return false;
      }

      // Status filter
      if (filter.status !== "All" && l.status !== filter.status) return false;

      // Priority filter
      if (filter.priority !== "All" && l.priority !== filter.priority) return false;

      // Source filter
      if (filter.source !== "All" && l.source !== filter.source) return false;

      // Text query
      if (filter.q) {
        const q = filter.q.toLowerCase();
        const hay =
          `${l.name} ${l.email} ${l.phone} ${l.company ?? ""} ${l.subject} ${l.message} ${l.notes ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [leads, filter]);

  // 6. Manual lead creation
  const onCreate = async (v: LeadFormValues) => {
    try {
      await addLead({
        name: v.name,
        company: v.company || undefined,
        email: v.email,
        phone: v.phone,
        subject: v.subject,
        message: v.message,
        source: (v.source as LeadSource) || "Contact Form",
        priority: (v.priority as LeadPriority) || "Medium",
        status: (v.status as LeadStatus) || "New",
        notes: v.notes || undefined,
      });
      setShowNew(false);
      toast.success("Lead created successfully");
    } catch {
      toast.error("Failed to save lead");
    }
  };

  // 7. Legacy import handler
  const handleImportLegacy = async () => {
    setImporting(true);
    try {
      const res = await importLegacyLeads();
      if (res.success) {
        toast.success(`Successfully imported ${res.count} local lead(s) to Supabase cloud!`);
        setHasLegacy(false);
      } else {
        toast.error(`Import failed: ${res.error || "Unknown error"}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to import local leads");
    } finally {
      setImporting(false);
    }
  };

  // 8. Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out");
      navigate({ to: "/admin/login" });
    } catch (err) {
      navigate({ to: "/admin/login" });
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center -mt-20 pt-20">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-candy-red" />
          <span>Verifying admin authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white -mt-20 pt-24 pb-16">
      <div className="container mx-auto px-4 space-y-6">
        {/* Top Notification / Migration Banner */}
        {hasLegacy && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200"
          >
            <div className="flex items-center gap-3 text-sm">
              <UploadCloud className="h-5 w-5 text-amber-300 shrink-0" />
              <span>
                <strong>Legacy leads detected in browser storage:</strong> You have offline leads
                saved locally in your browser. Migrate them to Supabase cloud storage so all team
                members can access them.
              </span>
            </div>
            <button
              onClick={handleImportLegacy}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {importing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Importing...
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" /> Import local leads to cloud
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              <span>Bonvik CRM</span>
              <span className="text-white/20">·</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio className={`h-3 w-3 ${realtimeActive ? "animate-pulse" : "opacity-40"}`} />
                {realtimeActive ? "Live Realtime" : "Auto-Syncing"}
              </span>
              {currentUserEmail && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-white/70 font-normal lowercase">{currentUserEmail}</span>
                </>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Lead Management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Unified real-time pipeline of Contact inquiries and Partner distributor applications
              stored in Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                fetchLeads();
                toast.success("Leads refreshed");
              }}
              title="Refresh leads"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>

            <button
              onClick={() => {
                if (filtered.length === 0) return toast.error("No leads to export");
                downloadCsv(
                  `bonvik-leads-${new Date().toISOString().slice(0, 10)}.csv`,
                  leadsToCsv(filtered),
                );
                toast.success(`Exported ${filtered.length} leads to CSV`);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>

            <button
              onClick={() => setShowNew((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-full bg-candy-red px-4 py-2 text-xs font-semibold text-white shadow-candy hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" /> New lead
            </button>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </motion.header>

        {/* New Lead Form Modal / Drawer */}
        {showNew && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-soft"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">Add Lead Manually</h2>
                <p className="text-xs text-white/50">
                  Create an inbound lead from phone, email, WhatsApp, or referral.
                </p>
              </div>
              <button
                onClick={() => setShowNew(false)}
                className="text-xs text-white/60 hover:text-white rounded-lg px-2 py-1 bg-white/5"
              >
                Cancel
              </button>
            </div>
            <LeadForm onSubmit={onCreate} submitLabel="Save Lead to Cloud" showAdminFields={true} />
          </motion.div>
        )}

        {/* Lead Stats */}
        <LeadStats leads={leads} />

        {/* Charts */}
        <LeadsChart leads={leads} />

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <LeadFilters value={filter} onChange={setFilter} />
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>
              Note: {error}. If RLS is enabled, ensure your user has admin role in Supabase.
            </span>
          </div>
        )}

        {/* Table / Content */}
        {!hydrated && loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/60 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-candy-red" />
            <span>Fetching unified leads from Supabase...</span>
          </div>
        ) : (
          <LeadTable leads={filtered} onOpen={setActive} />
        )}

        {/* Lead Drawer Details */}
        <LeadDrawer lead={active} onClose={() => setActive(null)} />
      </div>
    </div>
  );
}
