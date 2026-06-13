import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  firstName?: string;
  iat?: number;
  exp?: number;
}

// B13 FIX: Throw at startup rather than silently falling back to a
// hardcoded secret. Anyone who reads the source code would be able to forge
// tokens signed with the default value.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error(
    "JWT_SECRET environment variable is required but was not set. " +
    "Add it to your .env.local file."
  );
}
const secret = new TextEncoder().encode(rawSecret);

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
