import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Lead, LeadStatus } from "@/lib/leads/types";

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "#38bdf8",
  Contacted: "#f59e0b",
  Qualified: "#a78bfa",
  Won: "#34d399",
  Lost: "#fb7185",
};

export function LeadsChart({ leads }: { leads: Lead[] }) {
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => (map[l.status] = (map[l.status] ?? 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => (map[l.source] = (map[l.source] ?? 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const trendData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key.slice(5), count: 0 });
    }
    leads.forEach((l) => {
      const key = l.createdAt.slice(5, 10);
      const day = days.find((x) => x.date === key);
      if (day) day.count += 1;
    });
    return days;
  }, [leads]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Leads over last 14 days" span={2}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Line type="monotone" dataKey="count" stroke="#FF2E4D" strokeWidth={2.5} dot={{ r: 3, fill: "#FF2E4D" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="By status">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name as LeadStatus] ?? "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "white" }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card title="By source" span={3}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="value" fill="#3FB8FF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function Card({ title, children, span = 1 }: { title: string; children: React.ReactNode; span?: number }) {
  const spanCls = span === 2 ? "lg:col-span-2" : span === 3 ? "lg:col-span-3" : "";
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 ${spanCls}`}>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">{title}</div>
      {children}
    </div>
  );
}