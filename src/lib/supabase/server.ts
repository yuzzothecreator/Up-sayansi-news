import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKETS } from "@/lib/constants";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return url;
}

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }
  return key;
}

export function createServerClient() {
  return createSupabaseClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function uploadFileServer(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: Buffer | Blob,
  options?: { upsert?: boolean; contentType?: string },
) {
  const supabase = createServerClient();
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
    upsert: options?.upsert ?? false,
    contentType: options?.contentType,
  });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl.publicUrl,
  };
}

export async function deleteFileServer(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
) {
  const supabase = createServerClient();
  const bucketName = STORAGE_BUCKETS[bucket];

  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) throw error;
}

export async function createSignedUrl(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  expiresIn = 3600,
) {
  const supabase = createServerClient();
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

export { STORAGE_BUCKETS };
