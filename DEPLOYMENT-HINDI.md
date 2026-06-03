# ARAVALI ONE Website Deployment Guide

Ye project Vercel + Supabase par deploy karne ke liye ready hai.

## 1. Cloud Accounts

Create/login:

- Vercel: https://vercel.com
- Supabase: https://supabase.com
- Domain registrar: jahan se domain purchase kiya hai

## 2. Supabase Setup

1. Supabase me new project create karein.
2. SQL Editor open karein.
3. `supabase/schema.sql` ka full SQL paste karke run karein.
4. Storage buckets private rahenge:
   - `enquiry-documents`
   - `vendor-documents`

## 3. Vercel Deployment

1. Website code ko GitHub repository me push karein.
2. Vercel dashboard me `Add New Project` select karein.
3. GitHub repository import karein.
4. Framework preset: `Next.js`.
5. Environment Variables add karein:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ENQUIRY_BUCKET=enquiry-documents
SUPABASE_VENDOR_BUCKET=vendor-documents
ADMIN_REVIEW_TOKEN=strong-private-token
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://your-software-admin-url
NEXT_PUBLIC_EMPLOYEE_PORTAL_URL=https://your-software-employee-url
NEXT_PUBLIC_VENDOR_PORTAL_URL=https://your-software-vendor-url
```

6. Deploy button click karein.

## 4. Domain Connect Karna

1. Vercel project me `Settings > Domains` open karein.
2. Apna domain add karein, example: `aravalione.com`.
3. Vercel jo DNS records dega, unhe domain registrar ke DNS panel me add karein.
4. Usually records:
   - Apex/root domain ke liye `A` record
   - `www` ke liye `CNAME` record
5. DNS propagation me 10 minutes se 24 hours tak lag sakte hain.

## 5. Final Checks

- Home page open ho raha hai.
- Contact enquiry ID generate ho rahi hai.
- Vendor registration submit ho raha hai.
- Admin review token se vendor list load ho rahi hai.
- Approval ke baad vendor code generate ho raha hai.
- Login panel ke URLs real software portal par redirect kar rahe hain.

## 6. Important Security

- `SUPABASE_SERVICE_ROLE_KEY` kabhi browser/public code me expose na karein.
- `ADMIN_REVIEW_TOKEN` strong rakhein.
- PAN, cancelled cheque, bank details aur vendor documents Supabase private storage me hi rahenge.
