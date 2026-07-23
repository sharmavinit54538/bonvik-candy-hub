import { create } from "zustand";
import { leadStorage, generateLeadId } from "./storage";
import type { Lead, LeadPriority, LeadStatus, LeadSource } from "./types";

interface LeadState {
  leads: Lead[];
  hydrated: boolean;
  hydrate: () => void;
  addLead: (
    input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status" | "priority" | "source"> &
      Partial<Pick<Lead, "status" | "priority" | "source">>,
  ) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  duplicateLead: (id: string) => Lead | null;
  setStatus: (id: string, status: LeadStatus) => void;
  setPriority: (id: string, priority: LeadPriority) => void;
  clearAll: () => void;
}

function persist(leads: Lead[]) {
  leadStorage.write(leads);
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ leads: leadStorage.read(), hydrated: true });
  },
  addLead: (input) => {
    const now = new Date().toISOString();
    const lead: Lead = {
      id: generateLeadId(),
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      status: input.status ?? "New",
      priority: input.priority ?? "Medium",
      source: (input.source ?? "Contact Form") as LeadSource,
      createdAt: now,
      updatedAt: now,
      notes: input.notes,
    };
    const next = [lead, ...get().leads];
    persist(next);
    set({ leads: next });
    return lead;
  },
  updateLead: (id, patch) => {
    const next = get().leads.map((l) =>
      l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l,
    );
    persist(next);
    set({ leads: next });
  },
  deleteLead: (id) => {
    const next = get().leads.filter((l) => l.id !== id);
    persist(next);
    set({ leads: next });
  },
  duplicateLead: (id) => {
    const src = get().leads.find((l) => l.id === id);
    if (!src) return null;
    const now = new Date().toISOString();
    const copy: Lead = {
      ...src,
      id: generateLeadId(),
      status: "New",
      createdAt: now,
      updatedAt: now,
    };
    const next = [copy, ...get().leads];
    persist(next);
    set({ leads: next });
    return copy;
  },
  setStatus: (id, status) => get().updateLead(id, { status }),
  setPriority: (id, priority) => get().updateLead(id, { priority }),
  clearAll: () => {
    persist([]);
    set({ leads: [] });
  },
}));

export function useHydratedLeads() {
  const { leads, hydrated, hydrate } = useLeadStore();
  if (typeof window !== "undefined" && !hydrated) hydrate();
  return { leads: hydrated ? leads : [], hydrated };
}