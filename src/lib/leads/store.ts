import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { leadStorage } from "./storage";
import type { Lead, LeadPriority, LeadStatus, LeadSource, PartnerDetails } from "./types";

export interface LeadState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  fetchLeads: () => Promise<void>;
  addLead: (
    input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status" | "priority" | "source"> &
      Partial<Pick<Lead, "status" | "priority" | "source" | "notes">>,
  ) => Promise<Lead>;
  updateLead: (id: string, patch: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  duplicateLead: (id: string) => Promise<Lead | null>;
  setStatus: (id: string, status: LeadStatus) => Promise<void>;
  setPriority: (id: string, priority: LeadPriority) => Promise<void>;
  clearAll: () => Promise<void>;
  importLegacyLeads: () => Promise<{ success: boolean; count: number; error?: string }>;
}

function normalizeStatus(rawStatus?: string | null): LeadStatus {
  if (!rawStatus) return "New";
  const s = rawStatus.trim().toLowerCase();
  if (s === "contacted") return "Contacted";
  if (s === "qualified") return "Qualified";
  if (s === "won") return "Won";
  if (s === "lost") return "Lost";
  return "New";
}

function mapStatusToPartnerDb(status: LeadStatus): string {
  switch (status) {
    case "Contacted":
      return "contacted";
    case "Qualified":
      return "qualified";
    case "Won":
      return "won";
    case "Lost":
      return "lost";
    case "New":
    default:
      return "new";
  }
}

function mapPartnerRowToLead(row: any): Lead {
  const partnerDetails: PartnerDetails = {
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    address: row.address,
    gstNumber: row.gst_number,
    distributionType: row.distribution_type,
    yearsInBusiness: row.years_in_business,
    monthlyCapacity: row.monthly_capacity,
    warehouse: row.warehouse,
  };

  const messageLines = [
    row.distribution_type ? `Type: ${row.distribution_type}` : null,
    row.city && row.state ? `Location: ${row.city}, ${row.state} (${row.pincode || ""})` : null,
    row.address ? `Address: ${row.address}` : null,
    row.gst_number ? `GST: ${row.gst_number}` : null,
    row.monthly_capacity ? `Capacity: ${row.monthly_capacity}` : null,
    row.years_in_business ? `Years: ${row.years_in_business}` : null,
    row.warehouse ? `Warehouse: ${row.warehouse}` : null,
    row.message ? `Notes: ${row.message}` : null,
  ].filter(Boolean);

  return {
    id: row.id,
    name: row.full_name,
    company: row.business_name || undefined,
    email: row.email,
    phone: row.mobile,
    subject: `Partner Application · ${row.distribution_type ? row.distribution_type.toUpperCase() : "Distributor"} (${row.city || ""}, ${row.state || ""})`,
    message: messageLines.join("\n") || row.message || "Partner application submission",
    status: normalizeStatus(row.status),
    priority: "High",
    source: "Partner Form",
    createdAt: row.created_at,
    updatedAt: row.created_at,
    notes: row.message || undefined,
    partnerDetails,
  };
}

function mapDbLeadToLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    company: row.company || undefined,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: normalizeStatus(row.status),
    priority: (row.priority as LeadPriority) || "Medium",
    source: (row.source as LeadSource) || "Contact Form",
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    notes: row.notes || undefined,
  };
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  loading: false,
  error: null,
  hydrated: false,

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      // 1. Query leads table
      const { data: dbLeads, error: leadsErr } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      // 2. Query partner_applications table
      const { data: dbPartners, error: partnersErr } = await supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsErr && partnersErr) {
        console.error("[useLeadStore] Errors fetching leads and partners:", leadsErr, partnersErr);
        // Fallback to local storage if offline/RLS unauthorized
        const local = leadStorage.read();
        set({
          leads: local,
          loading: false,
          hydrated: true,
          error: leadsErr.message || "Failed to load cloud leads",
        });
        return;
      }

      const formattedLeads: Lead[] = (dbLeads || []).map(mapDbLeadToLead);
      const formattedPartners: Lead[] = (dbPartners || []).map(mapPartnerRowToLead);

      // Combine both sources in one unified list and sort newest first
      const unified = [...formattedLeads, ...formattedPartners].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      set({
        leads: unified,
        loading: false,
        hydrated: true,
        error: null,
      });
    } catch (err: any) {
      console.error("[useLeadStore] Fetch error:", err);
      const local = leadStorage.read();
      set({
        leads: local,
        loading: false,
        hydrated: true,
        error: err?.message || "An unexpected error occurred",
      });
    }
  },

  hydrate: async () => {
    await get().fetchLeads();
  },

  addLead: async (input) => {
    const now = new Date().toISOString();
    const source = (input.source ?? "Contact Form") as LeadSource;
    const status = input.status ?? "New";
    const priority = input.priority ?? "Medium";

    // Optimistic lead
    const optimisticLead: Lead = {
      id: crypto.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`,
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      status,
      priority,
      source,
      createdAt: now,
      updatedAt: now,
      notes: input.notes,
    };

    // Prepend optimistic lead
    set((state) => ({ leads: [optimisticLead, ...state.leads] }));

    try {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          name: input.name,
          company: input.company || null,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          message: input.message,
          status,
          priority,
          source,
          notes: input.notes || null,
        })
        .select("*")
        .single();

      if (error) {
        console.error("[useLeadStore] Failed to insert lead into Supabase:", error);
        throw error;
      }

      const savedLead = mapDbLeadToLead(data);
      // Replace optimistic lead with server response
      set((state) => ({
        leads: state.leads.map((l) => (l.id === optimisticLead.id ? savedLead : l)),
      }));

      return savedLead;
    } catch (err) {
      console.error("[useLeadStore] addLead error:", err);
      return optimisticLead;
    }
  },

  updateLead: async (id, patch) => {
    const existing = get().leads.find((l) => l.id === id);
    if (!existing) return;

    const now = new Date().toISOString();
    const updatedLead: Lead = { ...existing, ...patch, updatedAt: now };

    // Optimistic update
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
    }));

    try {
      if (existing.source === "Partner Form") {
        // Status updates on partner rows must write back to partner_applications.status
        const partnerUpdates: {
          status?: string;
          message?: string | null;
        } = {};
        if (patch.status) {
          partnerUpdates.status = mapStatusToPartnerDb(patch.status);
        }
        if (patch.notes !== undefined) {
          partnerUpdates.message = patch.notes || null;
        }

        if (Object.keys(partnerUpdates).length > 0) {
          const { error } = await supabase
            .from("partner_applications")
            .update(partnerUpdates)
            .eq("id", id);

          if (error) {
            console.error("[useLeadStore] Error updating partner application:", error);
            throw error;
          }
        }
      } else {
        // Standard lead update
        const dbPatch: {
          name?: string;
          company?: string | null;
          email?: string;
          phone?: string;
          subject?: string;
          message?: string;
          status?: string;
          priority?: string;
          source?: string;
          notes?: string | null;
        } = {};
        if (patch.name !== undefined) dbPatch.name = patch.name;
        if (patch.company !== undefined) dbPatch.company = patch.company || null;
        if (patch.email !== undefined) dbPatch.email = patch.email;
        if (patch.phone !== undefined) dbPatch.phone = patch.phone;
        if (patch.subject !== undefined) dbPatch.subject = patch.subject;
        if (patch.message !== undefined) dbPatch.message = patch.message;
        if (patch.status !== undefined) dbPatch.status = patch.status;
        if (patch.priority !== undefined) dbPatch.priority = patch.priority;
        if (patch.source !== undefined) dbPatch.source = patch.source;
        if (patch.notes !== undefined) dbPatch.notes = patch.notes || null;

        const { error } = await supabase.from("leads").update(dbPatch).eq("id", id);
        if (error) {
          console.error("[useLeadStore] Error updating lead:", error);
          throw error;
        }
      }
    } catch (err) {
      console.error("[useLeadStore] updateLead error:", err);
      // Rollback on failure
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? existing : l)),
      }));
      throw err;
    }
  },

  deleteLead: async (id) => {
    const existing = get().leads.find((l) => l.id === id);
    if (!existing) return;

    // Optimistic delete
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
    }));

    try {
      if (existing.source === "Partner Form") {
        const { error } = await supabase.from("partner_applications").delete().eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (error) throw error;
      }
    } catch (err) {
      console.error("[useLeadStore] deleteLead error:", err);
      // Rollback on failure
      set((state) => ({ leads: [existing, ...state.leads] }));
      throw err;
    }
  },

  duplicateLead: async (id) => {
    const src = get().leads.find((l) => l.id === id);
    if (!src) return null;

    const copyInput = {
      name: `${src.name} (Copy)`,
      company: src.company,
      email: src.email,
      phone: src.phone,
      subject: src.subject,
      message: src.message,
      status: "New" as LeadStatus,
      priority: src.priority,
      source: src.source === "Partner Form" ? ("Partner Form" as LeadSource) : src.source,
      notes: src.notes,
    };

    const duplicate = await get().addLead(copyInput);
    return duplicate;
  },

  setStatus: (id, status) => get().updateLead(id, { status }),
  setPriority: (id, priority) => get().updateLead(id, { priority }),

  clearAll: async () => {
    const oldLeads = get().leads;
    set({ leads: [] });
    try {
      // Clear leads table
      await supabase.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (err) {
      console.error("[useLeadStore] clearAll error:", err);
      set({ leads: oldLeads });
      throw err;
    }
  },

  importLegacyLeads: async () => {
    const localLeads = leadStorage.read();
    if (localLeads.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      const inserts = localLeads.map((l) => ({
        name: l.name,
        company: l.company || null,
        email: l.email,
        phone: l.phone,
        subject: l.subject || "Contact Enquiry",
        message: l.message || "",
        status: normalizeStatus(l.status),
        priority: l.priority || "Medium",
        source: l.source || "Contact Form",
        notes: l.notes || null,
        created_at: l.createdAt || new Date().toISOString(),
      }));

      const { error } = await supabase.from("leads").insert(inserts);
      if (error) {
        console.error("[importLegacyLeads] Error importing leads:", error);
        return { success: false, count: 0, error: error.message };
      }

      // Clear local storage after successful import
      leadStorage.clear();
      // Re-fetch all leads
      await get().fetchLeads();

      return { success: true, count: localLeads.length };
    } catch (err: any) {
      console.error("[importLegacyLeads] Unexpected import error:", err);
      return { success: false, count: 0, error: err?.message || "Import failed" };
    }
  },
}));

export function useHydratedLeads() {
  const { leads, hydrated, hydrate, loading, error } = useLeadStore();
  return { leads, hydrated, hydrate, loading, error };
}