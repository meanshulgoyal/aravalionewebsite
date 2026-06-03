import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VendorRegistrationForm } from "@/components/VendorRegistrationForm";

const reviewSteps = [
  "Application submitted with required KYC documents",
  "ARAVALI ONE team reviews statutory and banking details",
  "Approved vendors receive a generated vendor code",
  "Vendor login can be connected to the company software portal"
];

export default function VendorRegistrationPage() {
  return (
    <>
      <Header />
      <main className="bg-mist py-10">
        <div className="section-shell mb-6">
          <Link className="inline-flex items-center gap-2 text-sm font-black text-steel" href="/">
            <ArrowLeft size={18} aria-hidden />
            Back to website
          </Link>
        </div>
        <div className="section-shell grid gap-6 lg:grid-cols-[1.1fr_0.7fr] lg:items-start">
          <VendorRegistrationForm />
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="eyebrow">Review Flow</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Vendor Code After Approval</h2>
            <div className="mt-5 grid gap-4">
              {reviewSteps.map((step) => (
                <div className="flex gap-3" key={step}>
                  <CheckCircle2 className="mt-1 shrink-0 text-steel" size={20} aria-hidden />
                  <p className="text-sm font-bold leading-6 text-graphite">{step}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
