import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { LeadForm, type LeadFormValues } from "@/components/leads/LeadForm";
import { supabase } from "@/integrations/supabase/client";
import { notifyNewLead } from "@/lib/notifications";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bonvik Foods | Talk to our partner team" },
      { name: "description", content: "Get in touch with Bonvik Foods for distribution, wholesale and retail partnership enquiries across India." },
      { property: "og:title", content: "Contact Bonvik Foods" },
      { property: "og:description", content: "Reach our team for partnership, wholesale and retail enquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const onSubmit = async (values: LeadFormValues) => {
    const { error } = await supabase.from("leads").insert({
      name: values.name,
      company: values.company || null,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message,
      source: "Contact Form",
      status: "New",
      priority: "Medium",
    });

    if (error) {
      console.error("[ContactPage] Insert lead error:", error);
      toast.error("Couldn't send your message. Please check your connection or contact us directly via phone/email.");
      throw error;
    }

    // Trigger notification
    notifyNewLead({
      name: values.name,
      company: values.company,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message,
      source: "Contact Form",
    }).catch(() => {});

    toast.success("Thanks! We'll reply within 24 hours.");
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="container relative mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-foreground/70"
          >
            <MessageCircle size={14} /> We're listening
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight"
          >
            Say <span className="text-gradient-candy">hello</span>.
          </motion.h1>
          <p className="mt-5 text-foreground/70 max-w-xl mx-auto">
            Partnership, wholesale, retail or just a sweet idea — drop us a line.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {[
              { icon: Mail, label: "Email", value: "Bonvikfoods@gmail.com", href: "mailto:Bonvikfoods@gmail.com" },
              { icon: Phone, label: "Phone", value: "+91 99888 27786", href: "tel:+919988827786" },
              { icon: Phone, label: "Alt. Phone", value: "+91 98919 14300", href: "tel:+919891914300" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat with our partner team", href: "https://wa.me/919988827786" },
              { icon: MapPin, label: "Head Office", value: "New Shivaji Nagar, Hargobind Nagar Road, Ludhiana 141008, Punjab" },
            ].map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href ?? "#"}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-3xl glass p-5 hover:shadow-candy transition-shadow"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-candy text-white shadow-candy">
                  <c.icon size={20} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-foreground/50 font-semibold">{c.label}</span>
                  <span className="block font-display font-semibold">{c.value}</span>
                </span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-3xl glass p-6 md:p-8 shadow-soft"
          >
            <LeadForm onSubmit={onSubmit} />
          </motion.div>
        </div>
      </section>
    </>
  );
}