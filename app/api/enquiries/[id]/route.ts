import { NextResponse } from "next/server";
import { assertAdminAccess, getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const editableFields = [
  "name",
  "company",
  "mobile",
  "email",
  "enquiry_type",
  "material",
  "project_location",
  "message",
  "status"
] as const;

function tokenRequest(request: Request, token: unknown) {
  return new Request(request.url, {
    headers: {
      "x-admin-token": typeof token === "string" ? token : ""
    }
  });
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ mode: "demo", enquiry: null });
    }

    const body = await request.json().catch(() => ({}));
    assertAdminAccess(tokenRequest(request, body.token), true);
    const { id } = await context.params;
    const updates = body.updates || {};

    const row: Record<string, string> = {};
    for (const field of editableFields) {
      if (field in updates) {
        row[field] = cleanText(updates[field]);
      }
    }

    if (!Object.keys(row).length) {
      throw new Error("No enquiry updates supplied.");
    }

    const { data, error } = await supabase
      .from("enquiries")
      .update(row)
      .eq("id", id)
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
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ enquiry: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update enquiry." },
      { status: 401 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ mode: "demo", deleted: true });
    }

    const body = await request.json().catch(() => ({}));
    assertAdminAccess(tokenRequest(request, body.token), true);
    const { id } = await context.params;

    const { data: enquiry, error: findError } = await supabase
      .from("enquiries")
      .select("requirement_file_path")
      .eq("id", id)
      .single();

    if (findError) {
      throw findError;
    }

    if (enquiry.requirement_file_path) {
      const bucket = process.env.SUPABASE_ENQUIRY_BUCKET || "enquiry-documents";
      await supabase.storage.from(bucket).remove([enquiry.requirement_file_path]);
    }

    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete enquiry." },
      { status: 401 }
    );
  }
}
