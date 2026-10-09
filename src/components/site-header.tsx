import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-full px-4 md:px-6 py-2.5 transition-all ${
            scrolled ? "glass shadow-soft" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-candy text-white font-display font-bold shadow-candy">
              B
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-candy-yellow border-2 border-white" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Bonvik <span className="text-candy-red">Foods</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: "text-foreground bg-muted" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/partner"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-candy-red hover:text-white transition-colors shadow-pop"
            >
              Become Partner
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-3xl glass p-4 shadow-soft">
            <nav className="grid gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-medium hover:bg-muted"
                  activeProps={{ className: "bg-muted" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/partner"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-candy text-white px-5 py-3 text-sm font-semibold shadow-candy"
              >
                Become Partner
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
