import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Eye, Trash2, Files, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { useLeadStore } from "@/lib/leads/store";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import type { Lead, LeadPriority, LeadStatus } from "@/lib/leads/types";

type SortKey = "createdAt" | "name" | "status" | "priority" | "source";

function copy(text: string, label: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  try {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  } catch {
    toast.error(`Failed to copy ${label}`);
  }
}

export function LeadTable({ leads, onOpen }: { leads: Lead[]; onOpen: (l: Lead) => void }) {
  const { setStatus, setPriority, deleteLead, duplicateLead } = useLeadStore();
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const sorted = useMemo(() => {
    const arr = [...leads];
    arr.sort((a, b) => {
      let av: any = a[sort.key];
      let bv: any = b[sort.key];

      if (sort.key === "createdAt") {
        const at = new Date(a.createdAt).getTime();
        const bt = new Date(b.createdAt).getTime();
        return sort.dir === "asc" ? at - bt : bt - at;
      }

      if (av === bv) return 0;
      const cmp = String(av || "").localeCompare(String(bv || ""));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [leads, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key !== k ? null : sort.dir === "asc" ? <ChevronUp className="inline h-3.5 w-3.5" /> : <ChevronDown className="inline h-3.5 w-3.5" />;

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await setStatus(id, newStatus);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (id: string, newPriority: LeadPriority) => {
    try {
      await setPriority(id, newPriority);
      toast.success("Priority updated");
    } catch {
      toast.error("Failed to update priority");
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (typeof window !== "undefined" && window.confirm(`Delete lead "${lead.name}"? This action cannot be undone.`)) {
      try {
        await deleteLead(lead.id);
        toast.success("Lead deleted");
      } catch {
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateLead(id);
      toast.success("Lead duplicated");
    } catch {
      toast.error("Failed to duplicate lead");
    }
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/60">
        No leads match your current search and filters.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/50 border-b border-white/10">
            <tr>
              <Th onClick={() => toggle("name")}>Lead / Business <SortIcon k="name" /></Th>
              <Th>Contact Details</Th>
              <Th onClick={() => toggle("status")}>Status <SortIcon k="status" /></Th>
              <Th onClick={() => toggle("priority")}>Priority <SortIcon k="priority" /></Th>
              <Th onClick={() => toggle("source")}>Source <SortIcon k="source" /></Th>
              <Th onClick={() => toggle("createdAt")}>Submitted <SortIcon k="createdAt" /></Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageRows.map((l) => (
              <tr key={l.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-4 py-3.5">
                  <button onClick={() => onOpen(l)} className="text-left group-hover:text-candy-red transition-colors">
                    <div className="font-semibold text-white">{l.name}</div>
                    <div className="text-xs text-white/50">{l.company || l.id.slice(0, 8)}</div>
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="truncate max-w-[170px]">{l.email}</span>
                    <button onClick={() => copy(l.email, "Email")} title="Copy email" className="text-white/40 hover:text-white transition-colors">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
                    <span>{l.phone}</span>
                    <button onClick={() => copy(l.phone, "Phone")} title="Copy phone" className="text-white/40 hover:text-white transition-colors">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={l.status}
                    onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                    className="rounded-lg border border-white/10 bg-slate-900/80 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-candy-red cursor-pointer"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-slate-900">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <StatusBadge status={l.status} />
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={l.priority}
                    onChange={(e) => handlePriorityChange(l.id, e.target.value as LeadPriority)}
                    className="rounded-lg border border-white/10 bg-slate-900/80 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-candy-red cursor-pointer"
                  >
                    {LEAD_PRIORITIES.map((p) => (
                      <option key={p} value={p} className="bg-slate-900">
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <PriorityBadge priority={l.priority} />
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      l.source === "Partner Form"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                        : l.source === "Contact Form"
                        ? "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                        : "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                    }`}
                  >
                    {l.source}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-white/70 whitespace-nowrap">
                  <div>{new Date(l.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
                  <div className="text-[10px] text-white/40">{new Date(l.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn title="View details" onClick={() => onOpen(l)}>
                      <Eye className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Duplicate lead" onClick={() => handleDuplicate(l.id)}>
                      <Files className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Delete lead" onClick={() => handleDelete(l)}>
                      <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-300" />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Rows Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
        <div className="flex items-center gap-3">
          <span>
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, sorted.length)} of {sorted.length} leads
          </span>
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-white/10 bg-slate-900 px-2 py-0.5 text-xs text-white focus:outline-none"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            title="First page"
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="Previous page"
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            title="Next page"
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Last page"
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3.5 font-semibold ${
        onClick ? "cursor-pointer select-none hover:text-white transition-colors" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}

function IconBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}