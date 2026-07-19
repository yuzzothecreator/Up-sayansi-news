import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKETS } from "@/lib/constants";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return url;
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }
  return key;
}

export function createClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string },
) {
  const supabase = createClient();
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

export async function deleteFile(bucket: keyof typeof STORAGE_BUCKETS, path: string) {
  const supabase = createClient();
  const bucketName = STORAGE_BUCKETS[bucket];

  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) throw error;
}

export async function getPublicUrl(bucket: keyof typeof STORAGE_BUCKETS, path: string) {
  const supabase = createClient();
  const bucketName = STORAGE_BUCKETS[bucket];
  return supabase.storage.from(bucketName).getPublicUrl(path);
}

export { STORAGE_BUCKETS };
