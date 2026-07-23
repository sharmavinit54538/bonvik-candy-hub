import { Search, X } from "lucide-react";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/leads/types";
import type { LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";

export interface LeadFilterValue {
  q: string;
  status: LeadStatus | "All";
  priority: LeadPriority | "All";
  source: LeadSource | "All";
}

export function LeadFilters({
  value,
  onChange,
}: {
  value: LeadFilterValue;
  onChange: (next: LeadFilterValue) => void;
}) {
  const reset = () => onChange({ q: "", status: "All", priority: "All", source: "All" });
  const dirty = value.q || value.status !== "All" || value.priority !== "All" || value.source !== "All";

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Search name, email, phone, company, subject…"
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-candy-red"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={value.status} onChange={(v) => onChange({ ...value, status: v as LeadStatus | "All" })} options={["All", ...LEAD_STATUSES]} label="Status" />
        <Select value={value.priority} onChange={(v) => onChange({ ...value, priority: v as LeadPriority | "All" })} options={["All", ...LEAD_PRIORITIES]} label="Priority" />
        <Select value={value.source} onChange={(v) => onChange({ ...value, source: v as LeadSource | "All" })} options={["All", ...LEAD_SOURCES]} label="Source" />
        {dirty && (
          <button onClick={reset} className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10">
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-candy-red">
        {options.map((o) => (
          <option key={o} value={o} className="bg-slate-900 text-white">{label}: {o}</option>
        ))}
      </select>
    </label>
  );
}