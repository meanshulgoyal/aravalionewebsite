import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, verticals } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-ink py-10 text-white">
      <div className="section-shell grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black">{company.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Aggregate procurement, mining-linked operations, infra logistics and documentation-led
            supply execution.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-slate-300">
            <span className="flex gap-2">
              <MapPin size={17} aria-hidden />
              {company.registeredOffice}
            </span>
            <span className="flex gap-2">
              <Mail size={17} aria-hidden />
              {company.email}
            </span>
            <span className="flex gap-2">
              <Phone size={17} aria-hidden />
              {company.phone}
            </span>
          </div>
        </div>
        <div>
          <p className="font-black">Verticals</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            {verticals.slice(0, 6).map((vertical) => (
              <a href="/#verticals" key={vertical.title}>
                {vertical.title}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-black">Company</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <span>CIN: {company.cin}</span>
            <span>GSTIN: {company.gstin}</span>
            <Link href="/vendor-registration">Vendor Registration</Link>
            <Link href="/admin/enquiries">Enquiry Review</Link>
            <Link href="/admin/vendors">Vendor Review</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
