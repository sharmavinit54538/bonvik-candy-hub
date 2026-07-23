import type { Lead } from "./types";

function escapeCsv(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = ["id", "name", "company", "email", "phone", "subject", "message", "status", "priority", "source", "createdAt", "updatedAt"];
  const rows = leads.map((l) => headers.map((h) => escapeCsv(String((l as any)[h] ?? ""))).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}