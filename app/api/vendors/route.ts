import { NextResponse } from "next/server";
import {
  assertAdminAccess,
  dateStamp,
  demoId,
  getSupabaseAdmin,
  jsonObject,
  optionalFile,
  optionalText,
  requiredText,
  uploadFormFile
} from "@/lib/supabase";

export const runtime = "nodejs";

const requiredDocuments = [
  "gstCertificate",
  "panCard",
  "msmeCertificate",
  "cancelledCheque"
];

type DocumentPaths = Record<string, string | null>;

type VendorRow = {
  document_paths: DocumentPaths | null;
  [key: string]: unknown;
};

async function createVendorDocumentUrls(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  documentPaths: DocumentPaths | null
) {
  const bucket = process.env.SUPABASE_VENDOR_BUCKET || "vendor-documents";
  const entries = Object.entries(documentPaths || {});
  const urls: Record<string, string | null> = {};

  await Promise.all(
    entries.map(async ([key, path]) => {
      if (!path) {
        urls[key] = null;
        return;
      }

      const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 30);
      urls[key] = data?.signedUrl || null;
    })
  );

  return urls;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const application = {
      legalName: requiredText(form, "legalName"),
      tradeName: requiredText(form, "tradeName"),
      entityType: requiredText(form, "entityType"),
      category: requiredText(form, "category"),
      gstin: requiredText(form, "gstin"),
      pan: requiredText(form, "pan"),
      msmeNumber: optionalText(form, "msmeNumber"),
      registeredAddress: requiredText(form, "registeredAddress"),
      contactPerson: requiredText(form, "contactPerson"),
      mobile: requiredText(form, "mobile"),
      email: requiredText(form, "email"),
      bankName: requiredText(form, "bankName"),
      accountNumber: requiredText(form, "accountNumber"),
      ifsc: requiredText(form, "ifsc")
    };

    for (const documentName of requiredDocuments) {
      if (!optionalFile(form, documentName)) {
        throw new Error(`${documentName} upload is required.`);
      }
    }

    const applicationId = demoId(`AO-VAPP-${dateStamp()}`);
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        applicationId,
        status: "pending_review",
        mode: "demo"
      });
    }

    const documents: Record<string, string | null> = {};
    for (const documentName of requiredDocuments) {
      documents[documentName] = await uploadFormFile(
        supabase,
        process.env.SUPABASE_VENDOR_BUCKET || "vendor-documents",
        applicationId,
        documentName,
        optionalFile(form, documentName)
      );
    }

    const { data, error } = await supabase
      .from("vendor_applications")
      .insert({
        application_id: applicationId,
        legal_name: application.legalName,
        trade_name: application.tradeName,
        entity_type: application.entityType,
        category: application.category,
        gstin: application.gstin,
        pan: application.pan,
        msme_number: application.msmeNumber,
        registered_address: application.registeredAddress,
        contact_person: application.contactPerson,
        mobile: application.mobile,
        email: application.email,
        bank_details: jsonObject({
          bank_name: application.bankName,
          account_number: application.accountNumber,
          ifsc: application.ifsc
        }),
        document_paths: documents,
        status: "pending_review"
      })
      .select("application_id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      applicationId: data.application_id,
      status: "pending_review"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit vendor application." },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        mode: "demo",
        vendors: [
          {
            id: "demo-vendor-1",
            application_id: "AO-VAPP-DEMO-0001",
            legal_name: "Demo Material Supplier Pvt Ltd",
            trade_name: "Demo Aggregates",
            entity_type: "Private Limited",
            category: "Material Supplier",
            gstin: "23ABCDE1234F1Z5",
            pan: "ABCDE1234F",
            msme_number: "UDYAM-DEMO-0001",
            registered_address: "Demo Industrial Area, Gwalior, Madhya Pradesh",
            status: "pending_review",
            vendor_code: null,
            reviewed_at: null,
            created_at: new Date().toISOString(),
            contact_person: "Demo Contact",
            mobile: "+91-9000000000",
            email: "demo@example.com",
            bank_details: {
              bank_name: "Demo Bank",
              account_number: "0000000000",
              ifsc: "DEMO0000001"
            },
            document_paths: {},
            document_urls: {}
          }
        ]
      });
    }

    assertAdminAccess(request, true);

    const { data, error } = await supabase
      .from("vendor_applications")
      .select(
        [
          "id",
          "application_id",
          "legal_name",
          "trade_name",
          "entity_type",
          "category",
          "gstin",
          "pan",
          "msme_number",
          "registered_address",
          "contact_person",
          "mobile",
          "email",
          "bank_details",
          "document_paths",
          "status",
          "vendor_code",
          "reviewed_at",
          "created_at"
        ].join(", ")
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    const vendorRows = (data || []) as unknown as VendorRow[];
    const vendors = await Promise.all(
      vendorRows.map(async (vendor) => ({
        ...vendor,
        document_urls: await createVendorDocumentUrls(
          supabase,
          vendor.document_paths
        )
      }))
    );

    return NextResponse.json({ vendors });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load vendors." },
      { status: 401 }
    );
  }
}
