import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/leads/types";
import type { LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter name").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20).regex(/^[+\d\s\-()]+$/, "Digits and + - ( ) only"),
  subject: z.string().trim().min(2, "Add a subject").max(150),
  message: z.string().trim().min(5, "Message too short").max(1000),
  source: z.enum(["Contact Form", "Partner Form", "Referral", "Instagram", "WhatsApp", "Other"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Won", "Lost"]).optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadForm({
  onSubmit,
  submitLabel = "Send message",
  defaultValues,
  showAdminFields = false,
}: {
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  submitLabel?: string;
  defaultValues?: Partial<LeadFormValues>;
  showAdminFields?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      source: "Contact Form",
      priority: "Medium",
      status: "New",
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v);
          reset();
        } catch {
          // Keep form inputs on error
        }
      })}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.name?.message}>
          <input {...register("name")} className={inputCls} placeholder="e.g. Rajesh Kumar" />
        </Field>
        <Field label="Company / Business" error={errors.company?.message}>
          <input {...register("company")} className={inputCls} placeholder="e.g. Sweet Treats Co." />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className={inputCls} placeholder="name@company.com" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className={inputCls} placeholder="+91 98765 43210" />
        </Field>
      </div>

      {showAdminFields && (
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Lead Source" error={errors.source?.message}>
            <select {...register("source")} className={selectCls}>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority" error={errors.priority?.message}>
            <select {...register("priority")} className={selectCls}>
              {LEAD_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Initial Status" error={errors.status?.message}>
            <select {...register("status")} className={selectCls}>
              {LEAD_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <Field label="Subject" error={errors.subject?.message}>
        <input {...register("subject")} className={inputCls} placeholder="e.g. Distribution inquiry for Punjab region" />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea rows={showAdminFields ? 3 : 5} {...register("message")} className={inputCls} placeholder="Tell us more about your inquiry..." />
      </Field>

      {showAdminFields && (
        <Field label="Internal Notes (Optional)" error={errors.notes?.message}>
          <textarea rows={2} {...register("notes")} className={inputCls} placeholder="Internal admin notes..." />
        </Field>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-candy text-white px-6 py-3 text-sm font-semibold shadow-candy hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : (
          <>
            <Send size={16} /> {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-candy-red transition";

const selectCls =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-candy-red transition";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}