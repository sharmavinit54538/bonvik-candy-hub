import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-candy"
      >
        <div
          aria-hidden
          className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-all group-hover:opacity-60 group-hover:scale-125"
          style={{ background: product.tint }}
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-candy-cream to-white">
          <motion.img
            src={product.image}
            alt={`Bonvik ${product.name} pack`}
            loading="lazy"
            width={800}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          />
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-candy-red shadow-soft">
            {product.packPrice} / box
          </span>
        </div>
        <div className="relative mt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-bold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.tagline}</p>
            </div>
            <span className="shrink-0 rounded-full bg-foreground text-background px-3 py-1 text-xs font-semibold">
              MRP {product.mrp}
            </span>
          </div>
          <p className="mt-3 text-sm text-foreground/70 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.flavors.slice(0, 3).map((f) => (
              <span key={f} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/70">
                {f}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{product.pieces}</span>
            <Link
              to="/partner"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-candy text-white px-4 py-2 text-xs font-semibold shadow-candy hover:scale-105 transition-transform"
            >
              Inquire
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}