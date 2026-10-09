import type { Lead } from "./types";

export const LOCAL_STORAGE_LEADS_KEY = "bonvik.leads.v1";

export const leadStorage = {
  read(): Lead[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Lead[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("[leadStorage] Failed to read local leads:", err);
      return [];
    }
  },
  write(leads: Lead[]): boolean {
    if (typeof window === "undefined") return false;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
      return true;
    } catch (err) {
      console.warn("[leadStorage] Failed to write local leads:", err);
      return false;
    }
  },
  clear(): boolean {
    if (typeof window === "undefined") return false;
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_LEADS_KEY);
      return true;
    } catch (err) {
      console.warn("[leadStorage] Failed to clear local leads:", err);
      return false;
    }
  },
  hasLegacyLeads(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const leads = this.read();
      return leads.length > 0;
    } catch {
      return false;
    }
  }
};

export function generateLeadId(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LD-${y}${m}${d}-${rand}`;
}