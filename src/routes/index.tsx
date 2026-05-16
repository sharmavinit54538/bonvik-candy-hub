import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Truck, Heart, Star, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import heroCandies from "@/assets/hero-candies.png";
import { FloatingCandies } from "@/components/floating-candies";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bonvik Foods — Apna Bachpan | Premium Indian Candy Brand" },
      { name: "description", content: "Bonvik Foods crafts joyful lollipops, jellies and confectionery. Partner with India's fastest-growing candy brand." },
      { property: "og:title", content: "Bonvik Foods — Apna Bachpan" },
      { property: "og:description", content: "Premium Indian candy brand. Become a distributor partner today." },
    ],
  }),
  component: HomePage,
});

function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <FloatingCandies />
        <div className="container relative mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-foreground/70 shadow-soft">
                <Sparkles size={14} className="text-candy-red" />
                India's joyful candy brand
              </span>
              <h1 className="mt-5 font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                Sweet moments,{" "}
                <span className="text-gradient-candy">made in India.</span>
              </h1>
              <p className="mt-6 text-lg text-foreground/70 max-w-xl">
                Bonvik Foods crafts lollipops, jellies and chewy delights that bring back <em>Apna Bachpan</em> — and build serious business for our distributor partners.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/partner"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-candy text-white px-7 py-4 text-sm font-semibold shadow-candy hover:scale-105 transition-transform"
                >
                  Become a Partner
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-4 text-sm font-semibold shadow-pop hover:bg-candy-blue transition-colors"
                >
                  View Products
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { n: 500, s: "+", l: "Distributors" },
                  { n: 9, s: "+", l: "Products" },
                  { n: 25, s: "+", l: "States" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl md:text-4xl font-bold text-candy-red">
                      <Counter to={s.n} suffix={s.s} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <img
                  src={heroCandies}
                  alt="Bonvik Foods candies exploding with color"
                  width={1536}
                  height={1536}
                  className="w-full max-w-2xl mx-auto drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUSTED BAR */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="glass rounded-3xl shadow-soft px-6 py-5 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold uppercase tracking-wider text-foreground/50">
          <span>FSSAI Certified</span>
          <span className="hidden sm:inline">•</span>
          <span>ISO 22000</span>
          <span className="hidden sm:inline">•</span>
          <span>GST Registered</span>
          <span className="hidden md:inline">•</span>
          <span>Pan-India Logistics</span>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">Our Products</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">
              A counter-magnet for every age.
            </h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-candy-red transition-colors">
            See all products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* WHY BONVIK */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-sky opacity-10" aria-hidden />
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">Why Bonvik</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">
              Built for kids. Engineered for distributors.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { Icon: Shield, t: "Premium quality", d: "FSSAI-certified manufacturing with strict food-safety protocols on every batch." },
              { Icon: Truck, t: "Pan-India logistics", d: "Fast dispatch from regional hubs. Low MOQs to test new SKUs without risk." },
              { Icon: Heart, t: "Kid-loved branding", d: "Bright pack design and shelf-magnet shapes that drive impulse repeat sales." },
            ].map(({ Icon, t, d }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl bg-card p-8 shadow-soft hover:shadow-candy hover:-translate-y-1 transition-all"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-candy text-white shadow-candy">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-foreground/70">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">Partners say</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">
            Sweet returns, real stories.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { q: "Bonvik's Korean Swirly Pops sold out in 4 days. The packaging does the marketing for us.", n: "Ravi Mehta", r: "Distributor, Pune" },
            { q: "Margins are healthy and the team actually picks up the phone. Rare in FMCG today.", n: "Sana Khan", r: "Wholesaler, Lucknow" },
            { q: "We added Bonvik to 120 stores last quarter. Repeat orders are our proof.", n: "Vikram S.", r: "Super-stockist, Hyderabad" },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex gap-0.5 text-candy-yellow">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-foreground/80 text-lg leading-relaxed">"{t.q}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-candy text-white font-display font-bold flex items-center justify-center">
                  {t.n[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-candy p-10 md:p-16 text-white shadow-candy">
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-12 -left-12 h-72 w-72 rounded-full bg-candy-yellow/30 blur-3xl" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Ready to add Bonvik to your shelves?
            </h2>
            <p className="mt-4 text-white/90 text-lg">
              Apply in 3 minutes. Our partnerships team gets back within 48 hours with pricing, samples and your nearest hub.
            </p>
            <Link
              to="/partner"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-candy-red px-7 py-4 text-sm font-bold shadow-pop hover:scale-105 transition-transform"
            >
              Apply now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-sm font-semibold text-candy-red uppercase tracking-wider">FAQ</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">
              Everything you'd ask before partnering.
            </h2>
            <p className="mt-4 text-foreground/70 max-w-md">
              Can't find the answer? <Link to="/contact" className="text-candy-red underline underline-offset-4">Talk to our team</Link>.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { q: "What's the minimum order quantity?", a: "MOQ starts at just 1 carton per SKU — perfect for trial orders before scaling." },
              { q: "Do you support credit terms?", a: "After a 3-month relationship, qualifying partners get net-30 and other flexible terms." },
              { q: "How fast is dispatch?", a: "Orders dispatch within 24–48 hours from our nearest regional hub." },
              { q: "Do you provide marketing material?", a: "Yes — POS displays, shelf wobblers, danglers and digital creatives are bundled at no cost." },
            ].map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden transition-all ${open ? "shadow-soft" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left font-display font-semibold"
      >
        {q}
        <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-foreground/70">{a}</p>
      </motion.div>
    </div>
  );
}