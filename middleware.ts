import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const role = token?.role;
console.log("token kkkkkkkkkkkkkk: ",role);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login/admin', request.url));
  }

  if (pathname.startsWith('/merchant') && role !== 'merchant') {
    return NextResponse.redirect(new URL('/login/merchant', request.url));
  }
  if (pathname.startsWith('/staff') && role !== 'staff') {
    return NextResponse.redirect(new URL('/login/staff', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};