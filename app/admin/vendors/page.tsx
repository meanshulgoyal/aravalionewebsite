import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminVendorPanel } from "@/components/AdminVendorPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AdminVendorsPage() {
  return (
    <>
      <Header />
      <main className="bg-mist">
        <div className="section-shell pt-8">
          <Link className="inline-flex items-center gap-2 text-sm font-black text-steel" href="/">
            <ArrowLeft size={18} aria-hidden />
            Back to website
          </Link>
        </div>
        <AdminVendorPanel />
      </main>
      <Footer />
    </>
  );
}
