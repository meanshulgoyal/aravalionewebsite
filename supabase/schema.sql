create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values
  ('enquiry-documents', 'enquiry-documents', false),
  ('vendor-documents', 'vendor-documents', false)
on conflict (id) do nothing;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  name text not null,
  company text not null,
  mobile text not null,
  email text not null,
  enquiry_type text not null,
  material text not null,
  project_location text not null,
  message text not null,
  requirement_file_path text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.vendor_applications (
  id uuid primary key default gen_random_uuid(),
  application_id text not null unique,
  legal_name text not null,
  trade_name text not null,
  entity_type text not null,
  category text not null,
  gstin text not null,
  pan text not null,
  msme_number text,
  registered_address text not null,
  contact_person text not null,
  mobile text not null,
  email text not null,
  bank_details jsonb not null,
  document_paths jsonb not null,
  status text not null default 'pending_review',
  vendor_code text unique,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint vendor_status_check check (status in ('pending_review', 'approved', 'rejected'))
);

alter table public.enquiries enable row level security;
alter table public.vendor_applications enable row level security;

create index if not exists enquiries_lead_id_idx on public.enquiries (lead_id);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists vendor_applications_status_idx on public.vendor_applications (status);
create index if not exists vendor_applications_vendor_code_idx on public.vendor_applications (vendor_code);
create index if not exists vendor_applications_created_at_idx on public.vendor_applications (created_at desc);
