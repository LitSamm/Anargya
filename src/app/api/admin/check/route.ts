import { NextResponse } from 'next/server';
import { isRequestAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const authenticated = isRequestAuthenticatedAdmin(request);
  return NextResponse.json({ authenticated });
}
