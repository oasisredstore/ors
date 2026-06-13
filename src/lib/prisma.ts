import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl =
    process.env.DATABASE_URL ??
    `file://${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;

  const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

  const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(authToken ? { authToken } : {}),
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
