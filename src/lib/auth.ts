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
    .setExpirationTime("30d")
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

/**
 * Rolling session: if the current token expires in < 7 days, issue a fresh
 * 30-day token. Call this in the middleware on every authenticated request.
 * Returns the new token string, or null if no refresh is needed.
 */
export async function maybeRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const exp = payload.exp as number | undefined;
    if (!exp) return null;
    const sevenDaysSeconds = 60 * 60 * 24 * 7;
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (exp - nowSeconds < sevenDaysSeconds) {
      // Token is within 7 days of expiry — roll it
      const { exp: _e, iat: _i, ...rest } = payload as unknown as JWTPayload;
      return await signToken(rest);
    }
    return null;
  } catch {
    return null;
  }
}

