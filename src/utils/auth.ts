import { SignJWT, jwtVerify } from 'jose';

const secretString = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.SESSION_SECRET) || (typeof process !== 'undefined' && process.env.SESSION_SECRET) || 'super-secret-fallback-key-do-not-use-in-prod';
const secret = new TextEncoder().encode(secretString);

export async function createSessionToken(userId: string): Promise<string> {
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return jwt;
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (err) {
    return null;
  }
}
