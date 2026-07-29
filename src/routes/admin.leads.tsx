import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLeadStore } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { LeadStats } from "@/components/leads/LeadStats";
import { LeadsChart } from "@/components/leads/LeadsChart";
import { LeadFilters, type LeadFilterValue } from "@/components/leads/LeadFilters";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadDrawer } from "@/components/leads/LeadDrawer";
import { LeadForm, type LeadFormValues } from "@/components/leads/LeadForm";
import { downloadCsv, leadsToCsv } from "@/lib/leads/export";


export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Lead Management — Bonvik Foods" },
      { name: "description", content: "Local-first lead management dashboard for the Bonvik Foods sales team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  const { leads, hydrate, hydrated, addLead, clearAll } = useLeadStore();
  const [filter, setFilter] = useState<LeadFilterValue>({ q: "", status: "All", priority: "All", source: "All" });
  const [active, setActive] = useState<Lead | null>(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter.status !== "All" && l.status !== filter.status) return false;
      if (filter.priority !== "All" && l.priority !== filter.priority) return false;
      if (filter.source !== "All" && l.source !== filter.source) return false;
      if (filter.q) {
        const q = filter.q.toLowerCase();
        const hay = `${l.name} ${l.email} ${l.phone} ${l.company ?? ""} ${l.subject} ${l.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filter]);

  const onCreate = async (v: LeadFormValues) => {
    addLead({ ...v, source: "Contact Form" });
    setShowNew(false);
    toast.success("Lead added");
  };



  return (
    <div className="min-h-screen bg-slate-950 text-white -mt-20 pt-24 pb-16">
      <div className="container mx-auto px-4 space-y-6">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Bonvik CRM</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Lead Management</h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Every enquiry from Contact and Partner forms lives here — filter, sort, update status and export. Data is stored locally in your browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/contact" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">← Contact form</Link>

            <button
              onClick={() => { if (leads.length === 0) return toast.error("No leads to export"); downloadCsv(`bonvik-leads-${new Date().toISOString().slice(0, 10)}.csv`, leadsToCsv(leads)); }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button
              onClick={() => { if (leads.length === 0) return; if (typeof window !== "undefined" && window.confirm("Delete ALL leads? This cannot be undone.")) { clearAll(); toast.success("All leads cleared"); } }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
            <button onClick={() => setShowNew((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-candy-red px-4 py-2 text-xs font-semibold text-white shadow-candy hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> New lead
            </button>
          </div>
        </motion.header>

        {showNew && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Add a lead manually</h2>
              <button onClick={() => setShowNew(false)} className="text-xs text-white/60 hover:text-white">Cancel</button>
            </div>
            <LeadForm onSubmit={onCreate} submitLabel="Add lead" />
          </motion.div>
        )}

        <LeadStats leads={leads} />
        <LeadsChart leads={leads} />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <LeadFilters value={filter} onChange={setFilter} />
        </div>

        {!hydrated ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">Loading leads…</div>
        ) : (
          <LeadTable leads={filtered} onOpen={setActive} />
        )}

        <LeadDrawer lead={active} onClose={() => setActive(null)} />
      </div>
    </div>
  );
}