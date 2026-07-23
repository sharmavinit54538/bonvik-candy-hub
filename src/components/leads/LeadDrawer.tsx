import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Mail, Phone, Building2, Clock, Tag } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { Lead } from "@/lib/leads/types";

function copy(text: string, label: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
}

export function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/50">{lead.id}</div>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">{lead.name}</h3>
                <div className="mt-2 flex gap-2">
                  <StatusBadge status={lead.status} />
                  <PriorityBadge priority={lead.priority} />
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-white/80">
              {lead.company && <Row icon={Building2} label="Company">{lead.company}</Row>}
              <Row icon={Mail} label="Email">
                <span className="flex items-center gap-2">
                  <a href={`mailto:${lead.email}`} className="hover:text-candy-red">{lead.email}</a>
                  <button onClick={() => copy(lead.email, "Email")} className="text-white/50 hover:text-white"><Copy className="h-3.5 w-3.5" /></button>
                </span>
              </Row>
              <Row icon={Phone} label="Phone">
                <span className="flex items-center gap-2">
                  <a href={`tel:${lead.phone}`} className="hover:text-candy-red">{lead.phone}</a>
                  <button onClick={() => copy(lead.phone, "Phone")} className="text-white/50 hover:text-white"><Copy className="h-3.5 w-3.5" /></button>
                </span>
              </Row>
              <Row icon={Tag} label="Source">{lead.source}</Row>
              <Row icon={Clock} label="Created">{new Date(lead.createdAt).toLocaleString()}</Row>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Subject</div>
              <div className="mt-1 font-semibold text-white">{lead.subject}</div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/50">Message</div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{lead.message}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-white/50" />
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}