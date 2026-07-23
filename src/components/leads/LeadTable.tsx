import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Eye, Trash2, Files } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { useLeadStore } from "@/lib/leads/store";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import type { Lead, LeadPriority, LeadStatus } from "@/lib/leads/types";

type SortKey = "createdAt" | "name" | "status" | "priority";

function copy(text: string, label: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
}

export function LeadTable({ leads, onOpen }: { leads: Lead[]; onOpen: (l: Lead) => void }) {
  const { setStatus, setPriority, deleteLead, duplicateLead } = useLeadStore();
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const sorted = useMemo(() => {
    const arr = [...leads];
    arr.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      const cmp = String(av) > String(bv) ? 1 : -1;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [leads, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key !== k ? null : sort.dir === "asc" ? <ChevronUp className="inline h-3.5 w-3.5" /> : <ChevronDown className="inline h-3.5 w-3.5" />;

  if (leads.length === 0) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">No leads match your filters yet.</div>;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/50">
            <tr>
              <Th onClick={() => toggle("name")}>Lead <SortIcon k="name" /></Th>
              <Th>Contact</Th>
              <Th onClick={() => toggle("status")}>Status <SortIcon k="status" /></Th>
              <Th onClick={() => toggle("priority")}>Priority <SortIcon k="priority" /></Th>
              <Th>Source</Th>
              <Th onClick={() => toggle("createdAt")}>Created <SortIcon k="createdAt" /></Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageRows.map((l) => (
              <tr key={l.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <button onClick={() => onOpen(l)} className="text-left">
                    <div className="font-semibold text-white">{l.name}</div>
                    <div className="text-xs text-white/50">{l.company || l.id}</div>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <span className="truncate max-w-[160px]">{l.email}</span>
                    <button onClick={() => copy(l.email, "Email")} className="text-white/40 hover:text-white"><Copy className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <span>{l.phone}</span>
                    <button onClick={() => copy(l.phone, "Phone")} className="text-white/40 hover:text-white"><Copy className="h-3 w-3" /></button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)} className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs text-white focus:outline-none">
                    {LEAD_STATUSES.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                  <div className="mt-1"><StatusBadge status={l.status} /></div>
                </td>
                <td className="px-4 py-3">
                  <select value={l.priority} onChange={(e) => setPriority(l.id, e.target.value as LeadPriority)} className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs text-white focus:outline-none">
                    {LEAD_PRIORITIES.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                  </select>
                  <div className="mt-1"><PriorityBadge priority={l.priority} /></div>
                </td>
                <td className="px-4 py-3 text-xs text-white/70">{l.source}</td>
                <td className="px-4 py-3 text-xs text-white/70 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn title="View" onClick={() => onOpen(l)}><Eye className="h-4 w-4" /></IconBtn>
                    <IconBtn title="Duplicate" onClick={() => { duplicateLead(l.id); toast.success("Lead duplicated"); }}><Files className="h-4 w-4" /></IconBtn>
                    <IconBtn title="Delete" onClick={() => { if (typeof window !== "undefined" && window.confirm(`Delete lead ${l.name}?`)) { deleteLead(l.id); toast.success("Lead deleted"); } }}><Trash2 className="h-4 w-4" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
        <div>Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, sorted.length)} of {sorted.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/10 px-3 py-1 hover:bg-white/10 disabled:opacity-40">Prev</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-white/10 px-3 py-1 hover:bg-white/10 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

function Th({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <th className={`px-4 py-3 font-semibold ${onClick ? "cursor-pointer select-none hover:text-white" : ""} ${className}`} onClick={onClick}>{children}</th>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white">{children}</button>
  );
}