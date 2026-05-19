import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass shadow-soft border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0">
            <div className="absolute inset-0 gradient-orange rounded-tl-2xl rounded-br-2xl rotate-6" />
            <div className="absolute inset-0 gradient-tosca rounded-tr-2xl rounded-bl-2xl -rotate-6 opacity-90" />
            <Sparkles className="relative z-10 h-11 w-11 p-2.5 text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-extrabold text-[var(--brand-navy)] tracking-tight">AKADEMI</div>
            <div className="text-[10px] font-semibold text-[var(--brand-tosca)] tracking-[0.18em]">SOFT SKILLS INDONESIA</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="nav-link" activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/checkout" className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full gradient-orange text-[10px] font-bold text-white flex items-center justify-center">3</span>
          </Link>
          <a href={`https://wa.me/${SITE.whatsapp}`} className="hidden md:inline-flex items-center rounded-full border-2 border-[var(--brand-tosca)] px-5 py-2 text-sm font-semibold text-[var(--brand-tosca)] hover:bg-[var(--brand-tosca)] hover:text-white transition">
            Hubungi
          </a>
          <Link to="/training" className="hidden md:inline-flex items-center rounded-full gradient-orange px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:scale-105 transition">
            Mulai Belajar
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-secondary" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-[var(--brand-orange)]" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/training" onClick={() => setOpen(false)} className="mt-2 rounded-full gradient-orange px-5 py-2.5 text-center text-sm font-semibold text-white">
              Mulai Belajar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
