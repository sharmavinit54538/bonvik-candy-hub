import { Search, X, Calendar } from "lucide-react";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/leads/types";
import type { LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";

export type DateRangeFilter = "All" | "Today" | "7 days" | "30 days";

export interface LeadFilterValue {
  q: string;
  status: LeadStatus | "All";
  priority: LeadPriority | "All";
  source: LeadSource | "All";
  dateRange: DateRangeFilter;
}

export function LeadFilters({
  value,
  onChange,
}: {
  value: LeadFilterValue;
  onChange: (next: LeadFilterValue) => void;
}) {
  const reset = () =>
    onChange({ q: "", status: "All", priority: "All", source: "All", dateRange: "All" });

  const dirty =
    value.q ||
    value.status !== "All" ||
    value.priority !== "All" ||
    value.source !== "All" ||
    value.dateRange !== "All";

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Search name, email, phone, company, subject, message..."
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-candy-red"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={value.dateRange}
          onChange={(v) => onChange({ ...value, dateRange: v as DateRangeFilter })}
          options={["All", "Today", "7 days", "30 days"]}
          label="Date"
          icon={<Calendar className="inline mr-1 h-3.5 w-3.5 text-white/50" />}
        />
        <Select
          value={value.status}
          onChange={(v) => onChange({ ...value, status: v as LeadStatus | "All" })}
          options={["All", ...LEAD_STATUSES]}
          label="Status"
        />
        <Select
          value={value.priority}
          onChange={(v) => onChange({ ...value, priority: v as LeadPriority | "All" })}
          options={["All", ...LEAD_PRIORITIES]}
          label="Priority"
        />
        <Select
          value={value.source}
          onChange={(v) => onChange({ ...value, source: v as LeadSource | "All" })}
          options={["All", ...LEAD_SOURCES]}
          label="Source"
        />
        {dirty && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-candy-red cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-slate-900 text-white">
              {label}: {o}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
