import { NextResponse } from "next/server";
import {
  assertAdminAccess,
  demoId,
  generateSequentialId,
  getSupabaseAdmin
} from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        vendorCode: demoId(`AO-VND-${new Date().getFullYear()}`),
        mode: "demo"
      });
    }

    const tokenRequest = new Request(request.url, {
      headers: {
        "x-admin-token": body.token || ""
      }
    });
    assertAdminAccess(tokenRequest, true);

    const prefix = `AO-VND-${new Date().getFullYear()}`;
    const vendorCode = await generateSequentialId(
      supabase,
      "vendor_applications",
      "vendor_code",
      prefix
    );

    const { data, error } = await supabase
      .from("vendor_applications")
      .update({
        status: "approved",
        vendor_code: vendorCode,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("status", "pending_review")
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Vendor is not pending review.");
    }

    return NextResponse.json({ vendorCode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to approve vendor." },
      { status: 401 }
    );
  }
}
