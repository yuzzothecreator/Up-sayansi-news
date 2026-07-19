import { prisma } from "@/lib/prisma";

type DbProbeCache = {
  ok: boolean;
  checkedAt: number;
};

const globalForDb = globalThis as unknown as {
  __pulseDbProbe?: DbProbeCache;
};

const PROBE_TTL_MS = 30_000;

function forceMockData() {
  return process.env.USE_MOCK_DATA === "true";
}

function isConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  const message = "message" in error ? String(error.message) : "";
  return (
    name.includes("PrismaClientInitializationError") ||
    name.includes("PrismaClientKnownRequestError") ||
    message.includes("Can't reach database server") ||
    message.includes("Environment variable not found: DATABASE_URL") ||
    message.includes("P1001") ||
    message.includes("P1017") ||
    message.includes("ECONNREFUSED")
  );
}

/**
 * Returns whether Postgres is reachable. Result is cached briefly so pages
 * don't hammer a dead database on every request.
 */
export async function isDatabaseReady(): Promise<boolean> {
  if (forceMockData()) return false;

  const cached = globalForDb.__pulseDbProbe;
  if (cached && Date.now() - cached.checkedAt < PROBE_TTL_MS) {
    return cached.ok;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    globalForDb.__pulseDbProbe = { ok: true, checkedAt: Date.now() };
    return true;
  } catch {
    globalForDb.__pulseDbProbe = { ok: false, checkedAt: Date.now() };
    return false;
  }
}

export function markDatabaseUnavailable() {
  globalForDb.__pulseDbProbe = { ok: false, checkedAt: Date.now() };
}

export function isDbConnectionError(error: unknown) {
  return isConnectionError(error);
}
