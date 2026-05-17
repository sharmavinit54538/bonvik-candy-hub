import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 bg-hero-glow opacity-20" aria-hidden />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-candy text-white font-display font-bold">
                B
              </span>
              <span className="font-display text-xl font-bold">
                Bonvik <span className="text-candy-yellow">Foods</span>
              </span>
            </div>
            <p className="mt-4 text-background/70">
              Apna Bachpan… We craft joyful candies and partner with India's most ambitious distributors to put a smile on every counter.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-candy-red transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-background/60">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-background/80">
              <li><Link to="/products" className="hover:text-candy-yellow">Products</Link></li>
              <li><Link to="/about" className="hover:text-candy-yellow">About</Link></li>
              <li><Link to="/partner" className="hover:text-candy-yellow">Become Partner</Link></li>
              <li><Link to="/contact" className="hover:text-candy-yellow">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-background/60">
              Reach us
            </h4>
            <ul className="mt-4 space-y-3 text-background/80 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} /><span>partners@bonvikfoods.com</span></li>
              <li className="flex items-center gap-2"><Phone size={16} /><span>+91 90000 00000</span></li>
              <li className="text-background/60">Bonvik Foods Pvt. Ltd.<br />Manufacturing & HQ, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between text-sm text-background/60">
          <p>© {new Date().getFullYear()} Bonvik Foods. All rights reserved.</p>
          <p>Crafted with sugar, color & a lot of love.</p>
        </div>
      </div>
    </footer>
  );
}