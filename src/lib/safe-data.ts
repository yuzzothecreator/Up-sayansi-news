import {
  isDatabaseReady,
  isDbConnectionError,
  markDatabaseUnavailable,
} from "@/lib/db";

let warnedOffline = false;

function warnOnceOffline() {
  if (warnedOffline || process.env.NODE_ENV === "production") return;
  warnedOffline = true;
  console.warn(
    "[UpSayansi News] Database unavailable — serving mock data. Set USE_MOCK_DATA=false and configure DATABASE_URL when TiDB is ready.",
  );
}

export async function safeCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!(await isDatabaseReady())) {
    warnOnceOffline();
    return fallback;
  }

  try {
    return await fn();
  } catch (error) {
    if (isDbConnectionError(error)) {
      markDatabaseUnavailable();
      warnOnceOffline();
      return fallback;
    }
    throw error;
  }
}

export async function safeCallNullable<T>(
  fn: () => Promise<T | null>,
  fallback: T | null = null,
): Promise<T | null> {
  if (!(await isDatabaseReady())) {
    warnOnceOffline();
    return fallback;
  }

  try {
    return await fn();
  } catch (error) {
    if (isDbConnectionError(error)) {
      markDatabaseUnavailable();
      warnOnceOffline();
      return fallback;
    }
    throw error;
  }
}
