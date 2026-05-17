import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, type UseFormRegister, type FieldErrors, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Become a Partner — Bonvik Foods Distributor Program" },
      { name: "description", content: "Apply to become a Bonvik Foods distributor, wholesaler or retail partner. High-margin candy brand expanding pan-India." },
      { property: "og:title", content: "Bonvik Foods Partner Program" },
      { property: "og:description", content: "Join India's fastest-growing candy brand. Apply in 2 minutes." },
    ],
  }),
  component: PartnerPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  business_name: z.string().trim().min(2, "Business name required").max(120),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  email: z.string().trim().email("Enter a valid email").max(150),
  gst_number: z.string().trim().max(20).optional().or(z.literal("")),
  state: z.string().trim().min(2, "State required").max(60),
  city: z.string().trim().min(2, "City required").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  address: z.string().trim().min(5, "Address required").max(300),
  distribution_type: z.enum(["distributor", "wholesaler", "retailer", "super-stockist"], {
    errorMap: () => ({ message: "Choose a business type" }),
  }),
  years_in_business: z.enum(["<1", "1-3", "3-5", "5-10", "10+"]).optional(),
  monthly_capacity: z.enum(["<1L", "1-5L", "5-10L", "10-25L", "25L+"]).optional(),
  warehouse: z.enum(["yes", "no"]).optional(),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { id: "you", title: "About you", fields: ["full_name", "business_name", "mobile", "email"] as const },
  { id: "loc", title: "Location", fields: ["state", "city", "pincode", "address", "gst_number"] as const },
  { id: "biz", title: "Business", fields: ["distribution_type", "years_in_business", "monthly_capacity", "warehouse", "message"] as const },
];

const DRAFT_KEY = "bonvik:partner-draft";

function PartnerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { full_name: "", business_name: "", mobile: "", email: "", gst_number: "", state: "", city: "", pincode: "", address: "", message: "" },
  });

  const { register, handleSubmit, trigger, watch, reset, formState: { errors } } = form;

  // Auto-save draft
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) reset(JSON.parse(saved));
    } catch {}
  }, [reset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sub = watch((v) => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(v)); } catch {}
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const next = async () => {
    const ok = await trigger(steps[step].fields as unknown as (keyof FormValues)[]);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const { error } = await supabase.from("partner_applications").insert({
      full_name: values.full_name,
      business_name: values.business_name,
      mobile: values.mobile,
      email: values.email,
      state: values.state,
      city: values.city,
      address: values.address,
      pincode: values.pincode,
      gst_number: values.gst_number || null,
      years_in_business: values.years_in_business ?? null,
      distribution_type: values.distribution_type,
      monthly_capacity: values.monthly_capacity ?? null,
      warehouse: values.warehouse ?? null,
      message: values.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit. Please try again.");
      return;
    }
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    navigate({ to: "/partner/success" });
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="container relative mx-auto px-4 pt-28 pb-10 md:pt-32 md:pb-14 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-foreground/70">
            <Sparkles size={14} /> Partner Program · 2025
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
            Build a <span className="text-gradient-candy">sweet business</span> with us.
          </motion.h1>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
            Apply in 2 minutes. Our team will reach out within 24 hours with margins, MOQ and territory details.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-3xl">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center gap-2">
                <div className={`flex items-center gap-2 ${i <= step ? "text-foreground" : "text-foreground/40"}`}>
                  <motion.span
                    animate={{ scale: i === step ? 1.05 : 1 }}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      i < step ? "bg-candy-red text-white" : i === step ? "bg-gradient-candy text-white shadow-candy" : "bg-muted"
                    }`}
                  >
                    {i < step ? <Check size={16} /> : i + 1}
                  </motion.span>
                  <span className="hidden sm:block text-sm font-semibold">{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-gradient-candy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl glass p-6 md:p-8 shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <TextField name="full_name" label="Full name" register={register} errors={errors} />
                    <TextField name="business_name" label="Company / business" register={register} errors={errors} />
                    <TextField name="mobile" label="Mobile (10 digits)" register={register} errors={errors} inputMode="numeric" />
                    <TextField name="email" label="Email" type="email" register={register} errors={errors} />
                  </div>
                )}
                {step === 1 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <TextField name="state" label="State" register={register} errors={errors} />
                    <TextField name="city" label="City" register={register} errors={errors} />
                    <TextField name="pincode" label="Pincode" register={register} errors={errors} inputMode="numeric" />
                    <TextField name="gst_number" label="GST number (optional)" register={register} errors={errors} />
                    <div className="md:col-span-2">
                      <TextArea name="address" label="Address" register={register} errors={errors} rows={3} />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <SelectField
                      name="distribution_type"
                      label="Business type"
                      register={register}
                      errors={errors}
                      options={[
                        ["", "Select…"],
                        ["distributor", "Distributor"],
                        ["super-stockist", "Super Stockist"],
                        ["wholesaler", "Wholesaler"],
                        ["retailer", "Retailer"],
                      ]}
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <SelectField
                        name="years_in_business"
                        label="Years in business"
                        register={register}
                        errors={errors}
                        options={[["", "Select…"], ["<1", "Less than 1"], ["1-3", "1–3"], ["3-5", "3–5"], ["5-10", "5–10"], ["10+", "10+"]]}
                      />
                      <SelectField
                        name="monthly_capacity"
                        label="Monthly capacity"
                        register={register}
                        errors={errors}
                        options={[["", "Select…"], ["<1L", "< ₹1L"], ["1-5L", "₹1–5L"], ["5-10L", "₹5–10L"], ["10-25L", "₹10–25L"], ["25L+", "₹25L+"]]}
                      />
                      <SelectField
                        name="warehouse"
                        label="Warehouse"
                        register={register}
                        errors={errors}
                        options={[["", "Select…"], ["yes", "Yes"], ["no", "No"]]}
                      />
                    </div>
                    <TextArea name="message" label="Anything else? (optional)" register={register} errors={errors} rows={3} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-foreground/70 hover:text-foreground disabled:opacity-30"
              >
                <ArrowLeft size={16} /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-candy-red transition-colors shadow-pop"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-candy text-white px-6 py-3 text-sm font-semibold shadow-candy disabled:opacity-60"
                >
                  {submitting ? (<><Loader2 size={16} className="animate-spin" /> Submitting…</>) : (<>Submit application <ArrowRight size={16} /></>)}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

/* ---------- field primitives ---------- */

type FieldProps = {
  name: Path<FormValues>;
  label: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  type?: string;
  inputMode?: "text" | "numeric" | "email";
};

function fieldClass(hasError: boolean) {
  return `w-full rounded-2xl border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
    hasError ? "border-destructive ring-destructive/30" : "border-border focus:ring-candy-red"
  }`;
}

function TextField({ name, label, register, errors, type = "text", inputMode }: FieldProps) {
  const err = errors[name]?.message as string | undefined;
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      <input type={type} inputMode={inputMode} {...register(name)} className={fieldClass(!!err)} />
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}

function TextArea({ name, label, register, errors, rows = 3 }: FieldProps & { rows?: number }) {
  const err = errors[name]?.message as string | undefined;
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      <textarea rows={rows} {...register(name)} className={fieldClass(!!err)} />
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}

function SelectField({ name, label, register, errors, options }: FieldProps & { options: [string, string][] }) {
  const err = errors[name]?.message as string | undefined;
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      <select {...register(name)} className={fieldClass(!!err)}>
        {options.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
      </select>
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}