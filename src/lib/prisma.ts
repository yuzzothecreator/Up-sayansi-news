import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const log: Array<"error" | "warn"> =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

/**
 * TiDB serverless adapter expects:
 *   mysql://user:pass@host/database
 * (no port / ssl query params — those are for Prisma CLI TCP).
 */
function toTiDBServerlessUrl(databaseUrl: string) {
  const parsed = new URL(databaseUrl);
  const database = parsed.pathname.replace(/^\//, "") || "upsayansi";
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  return `mysql://${user}:${password}@${parsed.hostname}/${database}`;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  if (url?.startsWith("mysql://")) {
    const adapter = new PrismaTiDBCloud({ url: toTiDBServerlessUrl(url) });
    return new PrismaClient({ adapter, log });
  }

  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
