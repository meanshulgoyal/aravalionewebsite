"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2
} from "lucide-react";

type EnquiryLead = {
  id: string;
  lead_id: string;
  name: string;
  company: string;
  mobile: string;
  email: string;
  enquiry_type: string;
  material: string;
  project_location: string;
  message: string;
  requirement_file_path: string | null;
  requirement_file_url: string | null;
  status: string;
  created_at: string;
};

type EditableEnquiryField =
  | "name"
  | "company"
  | "mobile"
  | "email"
  | "enquiry_type"
  | "material"
  | "project_location"
  | "message";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" }
];

const editableFields: { key: EditableEnquiryField; label: string; wide?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
  { key: "mobile", label: "Mobile" },
  { key: "email", label: "Email" },
  { key: "enquiry_type", label: "Enquiry Type" },
  { key: "material", label: "Material / Vertical" },
  { key: "project_location", label: "Project Location" },
  { key: "message", label: "Message", wide: true }
];

function statusClass(status: string) {
  if (status === "closed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "cancelled") {
    return "bg-red-50 text-red-700";
  }
  if (status === "quoted") {
    return "bg-sky-50 text-sky-700";
  }
  if (status === "in_review") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-slate-100 text-slate-700";
}

function statusLabel(status: string) {
  return statusOptions.find((item) => item.value === status)?.label || status.replace("_", " ");
}

export function AdminEnquiryPanel() {
  const [token, setToken] = useState("");
  const [enquiries, setEnquiries] = useState<EnquiryLead[]>([]);
  const [message, setMessage] = useState("Enter the admin review token to load enquiry leads.");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const enquiryTypes = useMemo(
    () => Array.from(new Set(enquiries.map((enquiry) => enquiry.enquiry_type).filter(Boolean))),
    [enquiries]
  );

  const filteredEnquiries = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
      const matchesType = typeFilter === "all" || enquiry.enquiry_type === typeFilter;
      const haystack = [
        enquiry.lead_id,
        enquiry.name,
        enquiry.company,
        enquiry.mobile,
        enquiry.email,
        enquiry.enquiry_type,
        enquiry.material,
        enquiry.project_location,
        enquiry.message
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [enquiries, search, statusFilter, typeFilter]);

  async function loadEnquiries() {
    setLoading(true);
    setMessage("Loading enquiry leads...");
    try {
      const response = await fetch(`/api/enquiries?token=${encodeURIComponent(token)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load enquiries.");
      }
      setEnquiries(payload.enquiries);
      setMessage(payload.mode === "demo" ? "Showing demo enquiry data." : "Enquiry leads loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(id: string, field: EditableEnquiryField | "status", value: string) {
    setEnquiries((current) =>
      current.map((enquiry) => (enquiry.id === id ? { ...enquiry, [field]: value } : enquiry))
    );
  }

  async function saveEnquiry(enquiry: EnquiryLead, status = enquiry.status) {
    setLoading(true);
    setMessage("Saving enquiry updates...");
    try {
      const updates = editableFields.reduce<Record<string, string>>((current, field) => {
        current[field.key] = enquiry[field.key] || "";
        return current;
      }, {});

      const response = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          updates: {
            ...updates,
            status
          }
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to save enquiry.");
      }
      setEnquiries((current) =>
        current.map((item) =>
          item.id === enquiry.id
            ? {
                ...item,
                ...payload.enquiry,
                requirement_file_url: item.requirement_file_url
              }
            : item
        )
      );
      setMessage(`Enquiry ${enquiry.lead_id} updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save enquiry.");
    } finally {
      setLoading(false);
    }
  }

  async function setEnquiryStatus(enquiry: EnquiryLead, status: string) {
    updateDraft(enquiry.id, "status", status);
    await saveEnquiry({ ...enquiry, status }, status);
  }

  async function deleteEnquiry(id: string) {
    if (!window.confirm("Delete this enquiry and uploaded requirement file permanently?")) {
      return;
    }
    setLoading(true);
    setMessage("Deleting enquiry...");
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete enquiry.");
      }
      setEnquiries((current) => current.filter((enquiry) => enquiry.id !== id));
      setMessage("Enquiry and uploaded requirement file deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete enquiry.");
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
          <h1 className="mt-1 text-3xl font-black text-ink">Enquiry Leads</h1>
          <p className="mt-2 text-sm font-semibold text-mineral">
            Project enquiries are managed separately from vendor registrations.
          </p>
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
        <button className="button button-primary" disabled={loading} onClick={loadEnquiries} type="button">
          <RefreshCw size={18} aria-hidden />
          Load
        </button>
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-[1fr_180px_220px]">
        <label className="field-label normal-case">
          <span className="inline-flex items-center gap-2">
            <Search size={17} aria-hidden />
            Search
          </span>
          <input
            className="field-control"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Lead ID, company, mobile, location..."
            value={search}
          />
        </label>
        <label className="field-label normal-case">
          Status
          <select className="field-control" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label normal-case">
          Category
          <select className="field-control" onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}>
            <option value="all">All Enquiry Types</option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-mineral">
        {message} Showing {filteredEnquiries.length} of {enquiries.length} enquiry leads.
      </p>

      <div className="grid gap-4">
        {filteredEnquiries.map((enquiry) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" key={enquiry.id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-ink">{enquiry.company}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusClass(enquiry.status)}`}>
                    {statusLabel(enquiry.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-mineral">
                  {enquiry.lead_id} | {enquiry.enquiry_type} | {enquiry.project_location}
                </p>
                <p className="mt-2 text-sm text-mineral">
                  {enquiry.name} | {enquiry.mobile} | {enquiry.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="button button-ghost" disabled={loading} onClick={() => saveEnquiry(enquiry)} type="button">
                  <Save size={18} aria-hidden />
                  Save
                </button>
                <button className="button bg-sky-50 text-sky-700" disabled={loading} onClick={() => setEnquiryStatus(enquiry, "in_review")} type="button">
                  <RefreshCw size={18} aria-hidden />
                  Review
                </button>
                <button className="button button-dark" disabled={loading} onClick={() => setEnquiryStatus(enquiry, "quoted")} type="button">
                  <CheckCircle2 size={18} aria-hidden />
                  Quoted
                </button>
                <button className="button bg-emerald-50 text-emerald-700" disabled={loading} onClick={() => setEnquiryStatus(enquiry, "closed")} type="button">
                  <CheckCircle2 size={18} aria-hidden />
                  Close
                </button>
                <button className="button bg-slate-100 text-slate-700" disabled={loading} onClick={() => deleteEnquiry(enquiry.id)} type="button">
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
                      onChange={(event) => updateDraft(enquiry.id, field.key, event.target.value)}
                      value={enquiry[field.key] || ""}
                    />
                  ) : (
                    <input
                      className="field-control"
                      onChange={(event) => updateDraft(enquiry.id, field.key, event.target.value)}
                      value={enquiry[field.key] || ""}
                    />
                  )}
                </label>
              ))}
              <label className="field-label">
                Status
                <select
                  className="field-control"
                  onChange={(event) => updateDraft(enquiry.id, "status", event.target.value)}
                  value={enquiry.status}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              {enquiry.requirement_file_path && enquiry.requirement_file_url ? (
                <a
                  className="button button-ghost min-h-[42px] justify-between text-sm"
                  href={enquiry.requirement_file_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText size={17} aria-hidden />
                    Requirement Upload
                  </span>
                  <ExternalLink size={16} aria-hidden />
                </a>
              ) : (
                <span className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-bold text-mineral">
                  Requirement Upload: Not uploaded
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
