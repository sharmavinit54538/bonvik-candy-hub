import type { Lead } from "./types";

const KEY = "bonvik.leads.v1";

export const leadStorage = {
  read(): Lead[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Lead[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  write(leads: Lead[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(leads));
  },
};

export function generateLeadId(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LD-${y}${m}${d}-${rand}`;
}