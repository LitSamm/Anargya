import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'anargya2026';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (
      !body ||
      typeof body !== 'object' ||
      !('username' in body) ||
      !('password' in body) ||
      typeof body.username !== 'string' ||
      typeof body.password !== 'string'
    ) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    if (body.username !== ADMIN_USER || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createSessionToken(body.username);
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
