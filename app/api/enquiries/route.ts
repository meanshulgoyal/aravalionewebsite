import { NextResponse } from "next/server";
import {
  dateStamp,
  demoId,
  generateSequentialId,
  getSupabaseAdmin,
  optionalFile,
  requiredText,
  uploadFormFile
} from "@/lib/supabase";

export const runtime = "nodejs";

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
