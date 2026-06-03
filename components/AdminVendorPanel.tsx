"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

type VendorApplication = {
  id: string;
  legal_name: string;
  trade_name: string;
  category: string;
  status: string;
  vendor_code: string | null;
  created_at: string;
  contact_person: string;
  mobile: string;
  email: string;
};

export function AdminVendorPanel() {
  const [token, setToken] = useState("");
  const [vendors, setVendors] = useState<VendorApplication[]>([]);
  const [message, setMessage] = useState("Enter the admin review token to load pending vendors.");
  const [loading, setLoading] = useState(false);

  async function loadVendors() {
    setLoading(true);
    setMessage("Loading vendor applications...");
    try {
      const response = await fetch(`/api/vendors?token=${encodeURIComponent(token)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load vendors.");
      }
      setVendors(payload.vendors);
      setMessage(payload.mode === "demo" ? "Showing demo review data." : "Vendor applications loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load vendors.");
    } finally {
      setLoading(false);
    }
  }

  async function approveVendor(id: string) {
    setLoading(true);
    setMessage("Generating vendor code...");
    try {
      const response = await fetch(`/api/vendors/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to approve vendor.");
      }
      setVendors((current) =>
        current.map((vendor) =>
          vendor.id === id
            ? { ...vendor, status: "approved", vendor_code: payload.vendorCode }
            : vendor
        )
      );
      setMessage(`Vendor approved. Code: ${payload.vendorCode}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to approve vendor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-shell py-10">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-steel">
          <ShieldCheck size={22} aria-hidden />
        </span>
        <div>
          <p className="eyebrow">Admin Review</p>
          <h1 className="mt-1 text-3xl font-black text-ink">Vendor Applications</h1>
        </div>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_auto]">
        <input
          className="field-control"
          onChange={(event) => setToken(event.target.value)}
          placeholder="Admin review token"
          type="password"
          value={token}
        />
        <button className="button button-primary" disabled={loading} onClick={loadVendors} type="button">
          <RefreshCw size={18} aria-hidden />
          Load
        </button>
      </div>

      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-mineral">{message}</p>

      <div className="grid gap-4">
        {vendors.map((vendor) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" key={vendor.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-xl font-black text-ink">{vendor.legal_name}</h2>
                <p className="mt-1 text-sm font-semibold text-mineral">
                  {vendor.trade_name} | {vendor.category} | {vendor.status}
                </p>
                <p className="mt-2 text-sm text-mineral">
                  {vendor.contact_person} | {vendor.mobile} | {vendor.email}
                </p>
                {vendor.vendor_code ? (
                  <p className="mt-2 text-sm font-black text-emerald-700">Vendor Code: {vendor.vendor_code}</p>
                ) : null}
              </div>
              <button
                className="button button-dark"
                disabled={loading || vendor.status !== "pending_review"}
                onClick={() => approveVendor(vendor.id)}
                type="button"
              >
                <CheckCircle2 size={18} aria-hidden />
                Approve
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
