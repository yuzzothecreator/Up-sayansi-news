import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const useMockData = process.env.USE_MOCK_DATA === "true";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: useMockData
      ? ["error"]
      : process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
