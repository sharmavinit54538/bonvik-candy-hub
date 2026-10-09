import type { LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

const styles: Record<LeadStatus, string> = {
  New: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  Contacted: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Qualified: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  Won: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Lost: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
