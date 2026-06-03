import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  ShieldCheck,
  Truck
} from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LoginPanel } from "@/components/LoginPanel";
import { ClientLogos } from "@/components/ClientLogos";
import {
  clients,
  company,
  operatingPrinciples,
  projectHighlights,
  stats,
  verticals,
  workflow
} from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-white">
          <Image
            alt="Aerial quarry, crushing and logistics site"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            fill
            priority
            sizes="100vw"
            src="/images/hero-quarry-logistics.webp"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(24,33,47,0.90),rgba(24,33,47,0.66)_42%,rgba(24,33,47,0.18)_76%)]" />
          <div className="section-shell grid min-h-[calc(86svh-74px)] content-center py-16">
            <div className="max-w-3xl">
              <div className="inline-flex flex-col gap-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-black uppercase text-sky-100">{company.tagline}</p>
                <p className="text-xs font-extrabold uppercase text-slate-100">{company.groupLine}</p>
              </div>
              <h1 className="mt-4 text-balance text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
                {company.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
                Infrastructure material supply, mining-linked execution and logistics discipline
                built around SOPs, compliance, documentation and source-to-site traceability.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="button button-primary" href="#contact">
                  <ArrowRight size={19} aria-hidden />
                  Start Enquiry
                </a>
                <Link className="button bg-white text-ink" href="/vendor-registration">
                  Vendor Registration
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-6">
          <div className="section-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div className="rounded-lg border border-slate-200 p-4" key={item.label}>
                <p className="text-2xl font-black text-ink">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-mineral">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-mist py-16" id="about">
          <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="eyebrow">About ARAVALI ONE</p>
              <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
                A professionally governed material supply partner for infrastructure execution.
              </h2>
              <p className="mt-5 text-base leading-8 text-mineral">
                ARAVALI ONE PRIVATE LIMITED supports contractors and developers with aggregates,
                mining-linked supply, RMC, cement, industrial materials and infra logistics. The
                company is positioned around controlled sourcing, planned dispatch, clean records
                and accountable execution.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {operatingPrinciples.map((principle) => (
                  <div className="flex gap-3 rounded-lg bg-white p-4 shadow-soft" key={principle}>
                    <CheckCircle2 className="mt-1 shrink-0 text-steel" size={20} aria-hidden />
                    <p className="text-sm font-bold leading-6 text-graphite">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <Image
                alt="Fleet logistics support"
                className="h-auto w-full rounded-lg object-cover shadow-soft"
                height={550}
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/images/fleet-logistics.webp"
                width={1200}
              />
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm font-black text-ink">Operating Positioning</p>
                <p className="mt-2 text-sm leading-6 text-mineral">
                  Aggregate Procurement & Supply Management | Mining | Infra Logistics | Contractor
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16" id="verticals">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">Business Verticals</p>
              <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
                Materials, movement and documentation for demanding infrastructure sites.
              </h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {verticals.map((vertical) => {
                const Icon = vertical.icon;
                return (
                  <article
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft"
                    key={vertical.title}
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        alt={vertical.title}
                        className="object-cover"
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        src={vertical.image}
                      />
                    </div>
                    <div className="p-5">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-steel">
                        <Icon size={22} aria-hidden />
                      </span>
                      <h3 className="mt-4 text-xl font-black text-ink">{vertical.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-mineral">{vertical.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-ink py-16 text-white" id="projects">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-black uppercase text-sky-100">Projects & Clients</p>
                <h2 className="mt-3 text-balance text-4xl font-black leading-tight">
                  Trusted by infrastructure teams that value reliability at scale.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  ARAVALI ONE has supplied demanding road, rail, bridge, industrial and urban
                  infrastructure needs where quality, movement and document control must work
                  together.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {projectHighlights.map((project) => {
                  const Icon = project.icon;
                  return (
                    <article className="rounded-lg border border-white/12 bg-white/8 p-5" key={project.title}>
                      <Icon className="text-sky-100" size={24} aria-hidden />
                      <h3 className="mt-4 text-lg font-black">{project.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{project.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
            <ClientLogos clients={clients} />
          </div>
        </section>

        <section className="bg-mist py-16" id="quality">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">Quality & Documentation</p>
              <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
                Source-to-site transparency with records that stand up to review.
              </h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={step.title}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-steel">
                        <Icon size={22} aria-hidden />
                      </span>
                      <span className="text-sm font-black text-copper">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-black text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-mineral">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16" id="leadership">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.74fr_1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-lg bg-mist">
              <Image
                alt="Mr. Anshul Kumar Goyal"
                className="h-auto w-full object-cover"
                height={973}
                sizes="(max-width: 1024px) 100vw, 38vw"
                src="/images/director-anshul-goyal.webp"
                width={840}
              />
            </div>
            <div>
              <p className="eyebrow">Leadership</p>
              <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
                Mr. Anshul Kumar Goyal
              </h2>
              <p className="mt-2 text-lg font-black text-steel">Director | ARAVALI ONE PRIVATE LIMITED</p>
              <p className="mt-5 text-base leading-8 text-mineral">
                Mr. Goyal brings a system-driven approach to infrastructure operations, combining
                engineering discipline with ground-level execution. His leadership focuses on SOP
                controls, documentation accuracy, compliance-first execution, risk-managed planning
                and technology-enabled monitoring.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "SOP Control", icon: ClipboardList },
                  { label: "Audit Readiness", icon: FileText },
                  { label: "Governance", icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="rounded-lg border border-slate-200 p-4" key={item.label}>
                      <Icon className="text-steel" size={22} aria-hidden />
                      <p className="mt-3 text-sm font-black text-ink">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-mist py-16" id="contact">
          <div className="section-shell">
            <div className="mb-8 max-w-3xl">
              <p className="eyebrow">Contact & Access</p>
              <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
                Send a project enquiry or access the company software panel.
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <EnquiryForm />
              <div className="grid gap-5">
                <LoginPanel />
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                  <p className="text-sm font-black text-ink">{company.operatingBase}</p>
                  <p className="mt-2 text-sm leading-6 text-mineral">{company.registeredOffice}</p>
                  <p className="mt-4 text-sm font-bold text-graphite">{company.email}</p>
                  <p className="mt-1 text-sm font-bold text-graphite">{company.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
