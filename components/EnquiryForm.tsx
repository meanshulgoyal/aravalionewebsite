"use client";

import { useState } from "react";
import { Send, UploadCloud } from "lucide-react";
import { enquiryTypes } from "@/data/site";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; leadId: string; demoMode?: boolean }
  | { status: "error"; message: string };

export function EnquiryForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState({ status: "submitting" });
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        body: form
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit enquiry.");
      }
      formElement.reset();
      setState({
        status: "success",
        leadId: payload.leadId,
        demoMode: payload.mode === "demo"
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to submit enquiry."
      });
    }
  }

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Contact</p>
        <h3 className="mt-2 text-2xl font-black text-ink">Project Enquiry</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Name
          <input className="field-control" name="name" placeholder="Your name" required />
        </label>
        <label className="field-label">
          Company
          <input className="field-control" name="company" placeholder="Company / firm" required />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Mobile
          <input className="field-control" name="mobile" pattern="[0-9+\-\s]{8,16}" placeholder="+91..." required />
        </label>
        <label className="field-label">
          Email
          <input className="field-control" name="email" placeholder="name@company.com" type="email" required />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Enquiry Type
          <select className="field-control" name="enquiryType" required>
            <option value="">Select requirement</option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Material / Vertical
          <input className="field-control" name="material" placeholder="20 mm aggregate, logistics..." required />
        </label>
      </div>

      <label className="field-label">
        Project Location
        <input className="field-control" name="projectLocation" placeholder="City, district, state" required />
      </label>

      <label className="field-label">
        Message
        <textarea
          className="field-control min-h-[112px] resize-y"
          name="message"
          placeholder="Quantity, source/site, timeline and documentation requirements"
          required
        />
      </label>

      <label className="field-label">
        Requirement Upload
        <span className="relative flex min-h-[54px] items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-semibold normal-case text-mineral">
          <UploadCloud size={19} aria-hidden />
          <input className="w-full text-sm" name="requirementUpload" type="file" />
        </span>
      </label>

      <button className="button button-primary w-full" disabled={state.status === "submitting"} type="submit">
        <Send size={18} aria-hidden />
        {state.status === "submitting" ? "Submitting..." : "Submit Enquiry"}
      </button>

      {state.status === "success" ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
          Enquiry received. Lead ID: {state.leadId}
          {state.demoMode ? " (demo mode)" : ""}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{state.message}</p>
      ) : null}
    </form>
  );
}
