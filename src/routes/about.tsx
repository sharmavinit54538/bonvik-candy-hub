import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Factory, ShieldCheck, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bonvik Foods — Our Story & Mission" },
      { name: "description", content: "Bonvik Foods is on a mission to bring back Apna Bachpan with safe, joyful, premium Indian candies." },
      { property: "og:title", content: "About Bonvik Foods" },
      { property: "og:description", content: "Our story, mission, vision and manufacturing standards." },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2020", t: "Bonvik Foods is born", d: "A small team with a big dream — to build India's most-loved homegrown candy brand." },
  { year: "2022", t: "First 100 distributors", d: "We crossed 100 distributor partners across 8 states with our flagship Jelly Bears." },
  { year: "2024", t: "Korean Pops launch", d: "Launched the Korean Swirly Pops line — our fastest-selling SKU to date." },
  { year: "2026", t: "Pan-India presence", d: "Active in 25+ states with regional hubs and a growing export pipeline." },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-60" aria-hidden />
        <div className="container relative mx-auto px-4 py-20 md:py-28 max-w-3xl text-center">
          <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">Our story</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
            Built around <span className="text-gradient-candy">Apna Bachpan</span>.
          </h1>
          <p className="mt-6 text-lg text-foreground/70">
            Bonvik Foods started with a simple thought — childhood deserves better candy. Today we craft a premium range of confectionery loved by kids and trusted by retailers across India.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {[
          { Icon: Target, t: "Our Mission", d: "Make joyful, safe, premium candy accessible to every kid in India — and a smart business for every partner who sells it." },
          { Icon: Eye, t: "Our Vision", d: "Be India's #1 homegrown candy brand by 2030, with a presence on every counter from metros to rural India." },
        ].map(({ Icon, t, d }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl bg-card border border-border p-8 shadow-soft"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-candy text-white shadow-candy">
              <Icon size={22} />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">{t}</h2>
            <p className="mt-2 text-foreground/70">{d}</p>
          </motion.div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">Our journey</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">Sweet milestones.</h2>
        </div>
        <div className="relative mt-12 grid gap-6 md:gap-10">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          {timeline.map((e, i) => (
            <motion.div
              key={e.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`absolute left-0 md:static md:flex ${i % 2 ? "md:justify-start" : "md:justify-end"}`}>
                <span className="absolute left-1 md:hidden h-7 w-7 rounded-full bg-gradient-candy border-4 border-background" />
              </div>
              <div className={`rounded-3xl bg-card border border-border p-6 shadow-soft ${i % 2 ? "md:mr-0" : ""}`}>
                <div className="text-candy-red font-display font-bold text-2xl">{e.year}</div>
                <h3 className="mt-1 font-display text-xl font-bold">{e.t}</h3>
                <p className="mt-2 text-foreground/70 text-sm">{e.d}</p>
              </div>
              <div className="hidden md:flex items-center justify-center relative">
                <span className="h-5 w-5 rounded-full bg-gradient-candy ring-4 ring-background shadow-candy" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { Icon: Factory, t: "World-class manufacturing", d: "State-of-the-art facility with automated lines and strict batch QC." },
          { Icon: ShieldCheck, t: "Safety first", d: "FSSAI and ISO 22000 certified. Independent lab tests on every batch." },
          { Icon: Rocket, t: "Future-ready", d: "Investing in R&D, exports and 3 new product lines launching in 2026." },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="rounded-3xl bg-card border border-border p-7 shadow-soft hover:shadow-candy transition-shadow">
            <Icon className="text-candy-red" size={28} />
            <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
            <p className="mt-2 text-foreground/70 text-sm">{d}</p>
          </div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-[2.5rem] bg-gradient-candy text-white p-10 md:p-14 text-center shadow-candy">
          <h2 className="font-display text-3xl md:text-5xl font-bold">Partner with the candy brand that's growing fastest.</h2>
          <Link to="/partner" className="mt-7 inline-flex rounded-full bg-white text-candy-red px-7 py-4 font-bold shadow-pop hover:scale-105 transition-transform">
            Become a Partner
          </Link>
        </div>
      </section>
    </>
  );
}