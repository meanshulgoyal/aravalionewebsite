"use client";

import { useState } from "react";
import { Building2, Send, UploadCloud } from "lucide-react";
import { vendorCategories } from "@/data/site";

type VendorState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; applicationId: string; demoMode?: boolean }
  | { status: "error"; message: string };

const documentFields = [
  { name: "gstCertificate", label: "GST Certificate" },
  { name: "panCard", label: "PAN Card" },
  { name: "msmeCertificate", label: "MSME / Udyam Certificate" },
  { name: "cancelledCheque", label: "Cancelled Cheque" }
];

export function VendorRegistrationForm() {
  const [state, setState] = useState<VendorState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState({ status: "submitting" });
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        body: form
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit vendor application.");
      }
      formElement.reset();
      setState({
        status: "success",
        applicationId: payload.applicationId,
        demoMode: payload.mode === "demo"
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to submit vendor application."
      });
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-steel">
          <Building2 size={22} aria-hidden />
        </span>
        <div>
          <p className="eyebrow">Vendor KYC</p>
          <h1 className="mt-1 text-3xl font-black text-ink">Vendor Registration</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Legal Name
          <input className="field-control" name="legalName" required />
        </label>
        <label className="field-label">
          Trade Name
          <input className="field-control" name="tradeName" required />
        </label>
        <label className="field-label">
          Entity Type
          <select className="field-control" name="entityType" required>
            <option value="">Select entity</option>
            <option>Proprietorship</option>
            <option>Partnership</option>
            <option>LLP</option>
            <option>Private Limited</option>
            <option>Public Limited</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field-label">
          Category
          <select className="field-control" name="category" required>
            <option value="">Select category</option>
            {vendorCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="field-label">
          GSTIN
          <input className="field-control" name="gstin" required />
        </label>
        <label className="field-label">
          PAN
          <input className="field-control" name="pan" required />
        </label>
        <label className="field-label">
          MSME / Udyam No.
          <input className="field-control" name="msmeNumber" />
        </label>
      </div>

      <label className="field-label">
        Registered Address
        <textarea className="field-control min-h-[94px] resize-y" name="registeredAddress" required />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="field-label">
          Contact Person
          <input className="field-control" name="contactPerson" required />
        </label>
        <label className="field-label">
          Mobile
          <input className="field-control" name="mobile" pattern="[0-9+\-\s]{8,16}" required />
        </label>
        <label className="field-label">
          Email
          <input className="field-control" name="email" type="email" required />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="field-label">
          Bank Name
          <input className="field-control" name="bankName" required />
        </label>
        <label className="field-label">
          Account No.
          <input className="field-control" name="accountNumber" required />
        </label>
        <label className="field-label">
          IFSC
          <input className="field-control" name="ifsc" required />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documentFields.map((field) => (
          <label className="field-label" key={field.name}>
            {field.label}
            <span className="flex min-h-[54px] items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-semibold normal-case text-mineral">
              <UploadCloud size={19} aria-hidden />
              <input className="w-full text-sm" name={field.name} required type="file" />
            </span>
          </label>
        ))}
      </div>

      <button className="button button-primary w-full" disabled={state.status === "submitting"} type="submit">
        <Send size={18} aria-hidden />
        {state.status === "submitting" ? "Submitting..." : "Submit for Review"}
      </button>

      {state.status === "success" ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
          Application received. Reference: {state.applicationId}
          {state.demoMode ? " (demo mode)" : ""}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{state.message}</p>
      ) : null}
    </form>
  );
}
