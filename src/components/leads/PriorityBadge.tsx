import type { LeadPriority } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

const styles: Record<LeadPriority, string> = {
  Low: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  Medium: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  High: "bg-red-500/15 text-red-300 border-red-400/30",
};

export function PriorityBadge({ priority, className }: { priority: LeadPriority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}