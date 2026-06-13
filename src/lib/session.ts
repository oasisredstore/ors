import { cookies } from "next/headers";
import { verifyToken, type JWTPayload } from "./auth";

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function requireArtisan(): Promise<JWTPayload> {
  const session = await requireAuth();
  if (session.role !== "ARTISAN" && session.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

/** Any authenticated user (CUSTOMER, ARTISAN, ADMIN) */
export const requireSession = requireAuth;
