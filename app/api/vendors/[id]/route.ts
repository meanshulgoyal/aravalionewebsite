import { NextResponse } from "next/server";
import { assertAdminAccess, getSupabaseAdmin, jsonObject } from "@/lib/supabase";

export const runtime = "nodejs";

type BankDetails = {
  bank_name?: string | null;
  account_number?: string | null;
  ifsc?: string | null;
};

type DocumentPaths = Record<string, string | null>;

const editableFields = [
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
  "email"
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
      return NextResponse.json({ mode: "demo", vendor: null });
    }

    const body = await request.json().catch(() => ({}));
    assertAdminAccess(tokenRequest(request, body.token), true);
    const { id } = await context.params;
    const updates = body.updates || {};

    const row: Record<string, unknown> = {};
    for (const field of editableFields) {
      if (field in updates) {
        row[field] = field === "msme_number" ? cleanText(updates[field]) || null : cleanText(updates[field]);
      }
    }

    if (updates.bank_details && typeof updates.bank_details === "object") {
      const bank = updates.bank_details as BankDetails;
      row.bank_details = jsonObject({
        bank_name: cleanText(bank.bank_name),
        account_number: cleanText(bank.account_number),
        ifsc: cleanText(bank.ifsc)
      });
    }

    if (updates.status === "rejected") {
      row.status = "rejected";
      row.reviewed_at = new Date().toISOString();
    }

    if (!Object.keys(row).length) {
      throw new Error("No vendor updates supplied.");
    }

    const { data, error } = await supabase
      .from("vendor_applications")
      .update(row)
      .eq("id", id)
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
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ vendor: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update vendor." },
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

    const { data: vendor, error: findError } = await supabase
      .from("vendor_applications")
      .select("document_paths")
      .eq("id", id)
      .single();

    if (findError) {
      throw findError;
    }

    const documentPaths = vendor.document_paths as DocumentPaths | null;
    const paths = Object.values(documentPaths || {}).filter(
      (path): path is string => typeof path === "string" && path.length > 0
    );

    if (paths.length) {
      const bucket = process.env.SUPABASE_VENDOR_BUCKET || "vendor-documents";
      await supabase.storage.from(bucket).remove(paths);
    }

    const { error } = await supabase.from("vendor_applications").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete vendor." },
      { status: 401 }
    );
  }
}
