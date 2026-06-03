"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  XCircle
} from "lucide-react";

type BankDetails = {
  bank_name?: string;
  account_number?: string;
  ifsc?: string;
};

type VendorApplication = {
  id: string;
  application_id: string;
  legal_name: string;
  trade_name: string;
  entity_type: string;
  category: string;
  gstin: string;
  pan: string;
  msme_number: string | null;
  registered_address: string;
  contact_person: string;
  mobile: string;
  email: string;
  bank_details: BankDetails;
  document_paths: Record<string, string | null>;
  document_urls: Record<string, string | null>;
  status: string;
  vendor_code: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type EditableVendorField =
  | "legal_name"
  | "trade_name"
  | "entity_type"
  | "category"
  | "gstin"
  | "pan"
  | "msme_number"
  | "registered_address"
  | "contact_person"
  | "mobile"
  | "email";

const editableFields: { key: EditableVendorField; label: string; wide?: boolean }[] = [
  { key: "legal_name", label: "Legal Name" },
  { key: "trade_name", label: "Trade Name" },
  { key: "entity_type", label: "Entity Type" },
  { key: "category", label: "Category" },
  { key: "gstin", label: "GSTIN" },
  { key: "pan", label: "PAN" },
  { key: "msme_number", label: "MSME / Udyam No." },
  { key: "contact_person", label: "Contact Person" },
  { key: "mobile", label: "Mobile" },
  { key: "email", label: "Email" },
  { key: "registered_address", label: "Registered Address", wide: true }
];

const documentLabels: Record<string, string> = {
  gstCertificate: "GST Certificate",
  panCard: "PAN Card",
  msmeCertificate: "MSME / Udyam",
  cancelledCheque: "Cancelled Cheque"
};

function statusClass(status: string) {
  if (status === "approved") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "rejected") {
    return "bg-red-50 text-red-700";
  }
  return "bg-amber-50 text-amber-700";
}

export function AdminVendorPanel() {
  const [token, setToken] = useState("");
  const [vendors, setVendors] = useState<VendorApplication[]>([]);
  const [message, setMessage] = useState("Enter the admin review token to load vendor applications.");
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

  function updateDraft(id: string, field: EditableVendorField, value: string) {
    setVendors((current) =>
      current.map((vendor) => (vendor.id === id ? { ...vendor, [field]: value } : vendor))
    );
  }

  function updateBankDraft(id: string, field: keyof BankDetails, value: string) {
    setVendors((current) =>
      current.map((vendor) =>
        vendor.id === id
          ? { ...vendor, bank_details: { ...(vendor.bank_details || {}), [field]: value } }
          : vendor
      )
    );
  }

  async function saveVendor(vendor: VendorApplication) {
    setLoading(true);
    setMessage("Saving vendor corrections...");
    try {
      const updates = editableFields.reduce<Record<string, string | null>>((current, field) => {
        current[field.key] = vendor[field.key] || null;
        return current;
      }, {});

      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          updates: {
            ...updates,
            bank_details: vendor.bank_details || {}
          }
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to save vendor.");
      }
      setVendors((current) =>
        current.map((item) =>
          item.id === vendor.id ? { ...item, ...payload.vendor, document_urls: item.document_urls } : item
        )
      );
      setMessage("Vendor corrections saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save vendor.");
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

  async function rejectVendor(id: string) {
    if (!window.confirm("Reject this vendor application?")) {
      return;
    }
    setLoading(true);
    setMessage("Rejecting vendor application...");
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          updates: {
            status: "rejected"
          }
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to reject vendor.");
      }
      setVendors((current) =>
        current.map((vendor) =>
          vendor.id === id ? { ...vendor, ...payload.vendor, document_urls: vendor.document_urls } : vendor
        )
      );
      setMessage("Vendor application rejected.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reject vendor.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteVendor(id: string) {
    if (!window.confirm("Delete this vendor and uploaded documents permanently?")) {
      return;
    }
    setLoading(true);
    setMessage("Deleting vendor application...");
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete vendor.");
      }
      setVendors((current) => current.filter((vendor) => vendor.id !== id));
      setMessage("Vendor application and uploaded documents deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete vendor.");
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
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-ink">{vendor.legal_name}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusClass(vendor.status)}`}>
                    {vendor.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-mineral">
                  {vendor.application_id} | {vendor.trade_name} | {vendor.category}
                </p>
                {vendor.vendor_code ? (
                  <p className="mt-2 text-sm font-black text-emerald-700">Vendor Code: {vendor.vendor_code}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="button button-ghost" disabled={loading} onClick={() => saveVendor(vendor)} type="button">
                  <Save size={18} aria-hidden />
                  Save
                </button>
                <button
                  className="button bg-red-50 text-red-700"
                  disabled={loading || vendor.status === "rejected"}
                  onClick={() => rejectVendor(vendor.id)}
                  type="button"
                >
                  <XCircle size={18} aria-hidden />
                  Reject
                </button>
                <button
                  className="button button-dark"
                  disabled={loading || vendor.status !== "pending_review"}
                  onClick={() => approveVendor(vendor.id)}
                  type="button"
                >
                  <CheckCircle2 size={18} aria-hidden />
                  Approve
                </button>
                <button className="button bg-slate-100 text-slate-700" disabled={loading} onClick={() => deleteVendor(vendor.id)} type="button">
                  <Trash2 size={18} aria-hidden />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {editableFields.map((field) => (
                <label className={`field-label ${field.wide ? "md:col-span-2" : ""}`} key={field.key}>
                  {field.label}
                  {field.wide ? (
                    <textarea
                      className="field-control min-h-[88px] resize-y"
                      onChange={(event) => updateDraft(vendor.id, field.key, event.target.value)}
                      value={vendor[field.key] || ""}
                    />
                  ) : (
                    <input
                      className="field-control"
                      onChange={(event) => updateDraft(vendor.id, field.key, event.target.value)}
                      value={vendor[field.key] || ""}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="field-label">
                Bank Name
                <input
                  className="field-control"
                  onChange={(event) => updateBankDraft(vendor.id, "bank_name", event.target.value)}
                  value={vendor.bank_details?.bank_name || ""}
                />
              </label>
              <label className="field-label">
                Account No.
                <input
                  className="field-control"
                  onChange={(event) => updateBankDraft(vendor.id, "account_number", event.target.value)}
                  value={vendor.bank_details?.account_number || ""}
                />
              </label>
              <label className="field-label">
                IFSC
                <input
                  className="field-control"
                  onChange={(event) => updateBankDraft(vendor.id, "ifsc", event.target.value)}
                  value={vendor.bank_details?.ifsc || ""}
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(documentLabels).map(([key, label]) => {
                const path = vendor.document_paths?.[key];
                const url = vendor.document_urls?.[key];
                return path && url ? (
                  <a
                    className="button button-ghost min-h-[42px] justify-between text-sm"
                    href={url}
                    key={key}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FileText size={17} aria-hidden />
                      {label}
                    </span>
                    <ExternalLink size={16} aria-hidden />
                  </a>
                ) : (
                  <span className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-bold text-mineral" key={key}>
                    {label}: Not uploaded
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
