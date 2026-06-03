import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Menu } from "lucide-react";
import { company } from "@/data/site";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#verticals", label: "Verticals" },
  { href: "#projects", label: "Projects" },
  { href: "#quality", label: "Quality" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/92 backdrop-blur-xl">
      <div className="section-shell flex min-h-[74px] items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="relative h-14 w-[92px] shrink-0 overflow-hidden">
            <Image
              alt={`${company.shortName} logo`}
              fill
              sizes="92px"
              src="/images/aravali-one-transparent-logo.png"
              className="object-contain"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black text-ink sm:text-base">
              {company.shortName}
            </span>
            <span className="block text-xs font-semibold text-mineral">
              {company.tagline}
            </span>
            <span className="block text-[11px] font-bold text-steel">
              {company.groupLine}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-graphite lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="button button-ghost" href="/vendor-registration">
            <Building2 size={18} aria-hidden />
            Vendor Registration
          </Link>
          <a className="button button-primary" href="#contact">
            <ArrowRight size={18} aria-hidden />
            Enquire
          </a>
        </div>

        <details className="relative md:hidden">
          <summary className="button button-ghost list-none px-3">
            <Menu size={20} aria-hidden />
            Menu
          </summary>
          <div className="absolute right-0 mt-3 grid w-64 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-soft">
            {navItems.map((item) => (
              <a key={item.href} className="rounded-md px-3 py-2 text-sm font-bold" href={item.href}>
                {item.label}
              </a>
            ))}
            <Link className="rounded-md px-3 py-2 text-sm font-bold" href="/vendor-registration">
              Vendor Registration
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
