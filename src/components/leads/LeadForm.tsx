import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20).regex(/^[+\d\s\-()]+$/, "Digits and + - ( ) only"),
  subject: z.string().trim().min(2, "Add a subject").max(150),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadForm({ onSubmit, submitLabel = "Send message", defaultValues }: { onSubmit: (values: LeadFormValues) => Promise<void> | void; submitLabel?: string; defaultValues?: Partial<LeadFormValues> }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", subject: "", message: "", ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        await onSubmit(v);
        reset();
      })}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Your name" error={errors.name?.message}><input {...register("name")} className={inputCls} /></Field>
        <Field label="Company" error={errors.company?.message}><input {...register("company")} className={inputCls} /></Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Email" error={errors.email?.message}><input type="email" {...register("email")} className={inputCls} /></Field>
        <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className={inputCls} /></Field>
      </div>
      <Field label="Subject" error={errors.subject?.message}><input {...register("subject")} className={inputCls} /></Field>
      <Field label="Message" error={errors.message?.message}><textarea rows={5} {...register("message")} className={inputCls} /></Field>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-candy-red transition-colors shadow-pop disabled:opacity-60">
        {isSubmitting ? "Sending…" : (<><Send size={16} /> {submitLabel}</>)}
      </button>
    </form>
  );
}

const inputCls = "w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-candy-red transition";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}