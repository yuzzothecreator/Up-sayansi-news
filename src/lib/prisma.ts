import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const useMockData = process.env.USE_MOCK_DATA === "true";

const log: Array<"error" | "warn"> = useMockData
  ? ["error"]
  : process.env.NODE_ENV === "development"
    ? ["error", "warn"]
    : ["error"];

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  // TiDB Cloud MySQL URL — use the serverless HTTP adapter for Prisma Client.
  // Prisma CLI (db push / migrate) still uses TCP against the same DATABASE_URL.
  if (url?.startsWith("mysql://")) {
    const adapter = new PrismaTiDBCloud({ url });
    return new PrismaClient({ adapter, log });
  }

  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
