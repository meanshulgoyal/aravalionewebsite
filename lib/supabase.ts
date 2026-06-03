import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonMap = Record<string, JsonValue>;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function requiredText(form: FormData, key: string): string {
  const value = form.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }
  return value.trim();
}

export function optionalText(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}

export function optionalFile(form: FormData, key: string): File | null {
  const value = form.get(key);
  if (!value || typeof value !== "object" || !("arrayBuffer" in value) || !("name" in value)) {
    return null;
  }

  const file = value as File;
  return file.size > 0 ? file : null;
}

export function dateStamp(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
}

export function demoId(prefix: string): string {
  return `${prefix}-${String(Date.now()).slice(-4)}`;
}

export async function generateSequentialId(
  supabase: SupabaseClient,
  table: string,
  column: string,
  prefix: string
): Promise<string> {
  const { count, error } = await supabase
    .from(table)
    .select(column, { count: "exact", head: true })
    .like(column, `${prefix}-%`);

  if (error) {
    throw error;
  }

  return `${prefix}-${String((count || 0) + 1).padStart(4, "0")}`;
}

export async function uploadFormFile(
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  fieldName: string,
  file: File | null
): Promise<string | null> {
  if (!file) {
    return null;
  }

  const safeName = sanitizeFileName(file.name || `${fieldName}.bin`);
  const path = `${folder}/${fieldName}-${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (error) {
    throw error;
  }

  return path;
}

export function adminTokenFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  return request.headers.get("x-admin-token") || url.searchParams.get("token");
}

export function assertAdminAccess(request: Request, supabaseConfigured: boolean): void {
  const configuredToken = process.env.ADMIN_REVIEW_TOKEN;
  const providedToken = adminTokenFromRequest(request);

  if (!configuredToken && supabaseConfigured) {
    throw new Error("ADMIN_REVIEW_TOKEN must be configured before admin review can access live data.");
  }

  if (configuredToken && providedToken !== configuredToken) {
    throw new Error("Invalid admin review token.");
  }
}

export function jsonObject(input: JsonMap): JsonMap {
  return input;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}
