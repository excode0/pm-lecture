import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // console.log('🔥 Middleware berjalan...');
  // console.log('🔥 SECRET:', process.env.NEXTAUTH_SECRET);
  // console.log('🔥 Cookies:', req.cookies.getAll());
  // console.log('🔥 Headers Cookie:', req.headers.get('cookie'));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|login|signup|public).*)'],
};
