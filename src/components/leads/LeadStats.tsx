import { motion } from "framer-motion";
import { Users, Sparkles, PhoneCall, CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import type { Lead } from "@/lib/leads/types";

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

export function LeadStats({ leads }: { leads: Lead[] }) {
  const stats = [
    { label: "Total", value: leads.length, icon: Users, tone: "from-sky-500/30 to-sky-500/5" },
    { label: "Today", value: leads.filter((l) => isToday(l.createdAt)).length, icon: CalendarDays, tone: "from-violet-500/30 to-violet-500/5" },
    { label: "New", value: leads.filter((l) => l.status === "New").length, icon: Sparkles, tone: "from-blue-500/30 to-blue-500/5" },
    { label: "Contacted", value: leads.filter((l) => l.status === "Contacted").length, icon: PhoneCall, tone: "from-amber-500/30 to-amber-500/5" },
    { label: "Qualified", value: leads.filter((l) => l.status === "Qualified").length, icon: CheckCircle2, tone: "from-emerald-500/30 to-emerald-500/5" },
    { label: "Lost", value: leads.filter((l) => l.status === "Lost").length, icon: XCircle, tone: "from-rose-500/30 to-rose-500/5" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${s.tone} p-4 backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{s.label}</span>
            <s.icon className="h-4 w-4 text-white/70" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white tabular-nums">{s.value}</div>
        </motion.div>
      ))}
    </div>
  );
}