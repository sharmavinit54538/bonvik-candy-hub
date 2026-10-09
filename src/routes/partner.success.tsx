import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/partner/success")({
  head: () => ({
    meta: [
      { title: "Application received — Bonvik Foods" },
      {
        name: "description",
        content:
          "Thanks for applying to become a Bonvik Foods partner. Our team will reach out within 24 hours.",
      },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
      <div className="container relative mx-auto px-4 pt-32 pb-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-candy text-white shadow-candy"
        >
          <CheckCircle2 size={42} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-display text-4xl md:text-6xl font-bold tracking-tight"
        >
          You're in the <span className="text-gradient-candy">sweet list</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 text-foreground/70 max-w-lg mx-auto"
        >
          Our partnership team will reach out within 24 hours with margins, MOQ and next steps.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-candy-red transition-colors shadow-pop"
          >
            Explore products <ArrowRight size={16} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold"
          >
            Back home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
