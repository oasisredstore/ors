import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl =
    process.env.DATABASE_URL ??
    `file://${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;

  const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

  // B14 FIX: Manually instantiate the web version of libsql client to bypass 
  // Node.js undici fetch bugs ("expected non-null body source") in Next.js.
  const libsql = createClient({
    url: dbUrl,
    ...(authToken ? { authToken } : {}),
  });

  const adapter = new PrismaLibSql(libsql);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
