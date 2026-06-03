import { Building2, ExternalLink, ShieldCheck, UserRound } from "lucide-react";

const portalLinks = [
  {
    title: "Admin Login",
    description: "Review operations, vendor applications and internal controls.",
    href: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "#",
    icon: ShieldCheck
  },
  {
    title: "Employee Login",
    description: "Access employee workflows through the company software portal.",
    href: process.env.NEXT_PUBLIC_EMPLOYEE_PORTAL_URL || "#",
    icon: UserRound
  },
  {
    title: "Vendor Login",
    description: "Registered vendors can access their assigned software portal.",
    href: process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || "#",
    icon: Building2
  }
];

export function LoginPanel() {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <p className="eyebrow">Software Access</p>
      <h3 className="mt-2 text-2xl font-black text-ink">Login Panel</h3>
      <p className="mt-2 text-sm leading-6 text-mineral">
        Portal links are configurable at deployment and can be replaced with API or SSO integration later.
      </p>
      <div className="mt-5 grid gap-3">
        {portalLinks.map((link) => {
          const Icon = link.icon;
          const disabled = link.href === "#";
          return (
            <a
              aria-disabled={disabled}
              className="group grid grid-cols-[42px_1fr_18px] items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-steel/40 hover:bg-slate-50"
              href={link.href}
              key={link.title}
              rel="noreferrer"
              target={disabled ? undefined : "_blank"}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-mist text-steel">
                <Icon size={19} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-black text-ink">{link.title}</span>
                <span className="mt-1 block text-xs leading-5 text-mineral">{link.description}</span>
              </span>
              <ExternalLink className="text-mineral transition group-hover:text-steel" size={17} aria-hidden />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
