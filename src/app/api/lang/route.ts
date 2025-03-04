import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { lang } = await req.json();
  const res = NextResponse.json({ message: 'Language updated' });
  res.cookies.set('lang', lang, { path: '/' });
  return res;
}
