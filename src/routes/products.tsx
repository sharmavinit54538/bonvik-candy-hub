import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Bonvik Foods Lollipops, Jellies & Candies" },
      {
        name: "description",
        content:
          "Explore the full Bonvik Foods range: Korean Swirly Pops, Jelly Bears, Twist Spring Pops, Fruity Pop and more.",
      },
      { property: "og:title", content: "Bonvik Foods Product Range" },
      {
        property: "og:description",
        content: "Premium Indian candies built for distributors, wholesalers and retailers.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="container relative mx-auto px-4 py-20 md:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-foreground/70"
          >
            The Bonvik Range
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight"
          >
            One brand. <span className="text-gradient-candy">Nine ways</span> to smile.
          </motion.h1>
          <p className="mt-5 text-foreground/70 max-w-2xl mx-auto">
            From classic gummy bears to Korean-style swirl pops, every Bonvik product is engineered
            to fly off the counter.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
