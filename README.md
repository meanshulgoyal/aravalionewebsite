# ARAVALI ONE Dynamic Website

Premium corporate Next.js website for ARAVALI ONE PRIVATE LIMITED with public company sections, enquiry lead generation, vendor KYC submission, portal login links and lightweight admin vendor approval.

## Tech Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase Database and Storage
- lucide-react icons
- Optimized WebP assets in `public/images`

## Local Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env.local` and update portal/Supabase values.

3. Run the development server:

   ```powershell
   npm run dev
   ```

The forms return demo IDs when Supabase variables are missing. Live storage and database writes start after `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Keep both storage buckets private:
   - `enquiry-documents`
   - `vendor-documents`
4. Set these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ENQUIRY_BUCKET`
   - `SUPABASE_VENDOR_BUCKET`
   - `ADMIN_REVIEW_TOKEN`

## Portal Links

Set these values when the company software URLs are available:

- `NEXT_PUBLIC_ADMIN_PORTAL_URL`
- `NEXT_PUBLIC_EMPLOYEE_PORTAL_URL`
- `NEXT_PUBLIC_VENDOR_PORTAL_URL`

The current implementation redirects to portal URLs. It can later be upgraded to API/SSO integration without changing the public website structure.

## Deployment

Deploy on Vercel, add the purchased domain in Vercel project settings, and update DNS at the domain registrar with Vercel's required records.

## Privacy Notes

Only public-safe images were placed in `public/images`. PAN, TAN, bank, cancelled cheque, certificates and private KYC documents are not published as website assets.
