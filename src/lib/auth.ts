import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'anargya2026';
const SECRET_KEY = process.env.ADMIN_SECRET || 'anargya-its-formula-electric-secret-key-2026';

export const SESSION_COOKIE_NAME = 'anargya_admin_session';

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as unknown;
    if (
      data &&
      typeof data === 'object' &&
      'expiresAt' in data &&
      typeof data.expiresAt === 'number'
    ) {
      return data.expiresAt > Date.now();
    }
    return false;
  } catch {
    return false;
  }
}

export function isRequestAuthenticatedAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : undefined;
  return verifySessionToken(token);
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
