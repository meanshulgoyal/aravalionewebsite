import { NextResponse } from "next/server";
import {
  assertAdminAccess,
  dateStamp,
  demoId,
  generateSequentialId,
  getSupabaseAdmin,
  optionalFile,
  requiredText,
  uploadFormFile
} from "@/lib/supabase";

export const runtime = "nodejs";

type EnquiryRow = {
  requirement_file_path: string | null;
  [key: string]: unknown;
};

async function createRequirementFileUrl(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  path: string | null
) {
  if (!path) {
    return null;
  }

  const bucket = process.env.SUPABASE_ENQUIRY_BUCKET || "enquiry-documents";
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 30);
  return data?.signedUrl || null;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const enquiry = {
      name: requiredText(form, "name"),
      company: requiredText(form, "company"),
      mobile: requiredText(form, "mobile"),
      email: requiredText(form, "email"),
      enquiryType: requiredText(form, "enquiryType"),
      material: requiredText(form, "material"),
      projectLocation: requiredText(form, "projectLocation"),
      message: requiredText(form, "message")
    };

    const supabase = getSupabaseAdmin();
    const prefix = `AO-ENQ-${dateStamp()}`;

    if (!supabase) {
      return NextResponse.json({
        leadId: demoId(prefix),
        mode: "demo"
      });
    }

    const leadId = await generateSequentialId(supabase, "enquiries", "lead_id", prefix);
    const uploadPath = await uploadFormFile(
      supabase,
      process.env.SUPABASE_ENQUIRY_BUCKET || "enquiry-documents",
      leadId,
      "requirement",
      optionalFile(form, "requirementUpload")
    );

    const { error } = await supabase.from("enquiries").insert({
      lead_id: leadId,
      name: enquiry.name,
      company: enquiry.company,
      mobile: enquiry.mobile,
      email: enquiry.email,
      enquiry_type: enquiry.enquiryType,
      material: enquiry.material,
      project_location: enquiry.projectLocation,
      message: enquiry.message,
      requirement_file_path: uploadPath,
      status: "new"
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ leadId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit enquiry." },
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
        enquiries: [
          {
            id: "demo-enquiry-1",
            lead_id: "AO-ENQ-DEMO-0001",
            name: "Demo Client",
            company: "Demo Infra Pvt Ltd",
            mobile: "+91-9000000000",
            email: "demo@example.com",
            enquiry_type: "Aggregate Supply",
            material: "20mm aggregate",
            project_location: "Gwalior, Madhya Pradesh",
            message: "Demo enquiry requirement for admin review.",
            requirement_file_path: null,
            requirement_file_url: null,
            status: "new",
            created_at: new Date().toISOString()
          }
        ]
      });
    }

    assertAdminAccess(request, true);

    const { data, error } = await supabase
      .from("enquiries")
      .select(
        [
          "id",
          "lead_id",
          "name",
          "company",
          "mobile",
          "email",
          "enquiry_type",
          "material",
          "project_location",
          "message",
          "requirement_file_path",
          "status",
          "created_at"
        ].join(", ")
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    const enquiryRows = (data || []) as unknown as EnquiryRow[];
    const enquiries = await Promise.all(
      enquiryRows.map(async (enquiry) => ({
        ...enquiry,
        requirement_file_url: await createRequirementFileUrl(
          supabase,
          enquiry.requirement_file_path
        )
      }))
    );

    return NextResponse.json({ enquiries });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load enquiries." },
      { status: 401 }
    );
  }
}
