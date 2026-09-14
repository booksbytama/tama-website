import { NextResponse } from 'next/server';
import { ensureUser } from '@/lib/auth';
import { signedDownloadUrl } from '@/lib/db/downloads';
import { checkLimit } from '@/lib/ratelimit';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await ensureUser();
  if (!user) return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
  if (!(await checkLimit('downloads', user.id))) return new NextResponse('Too many downloads, try again later.', { status: 429 });
  const { slug } = await params;
  const url = await signedDownloadUrl(slug);
  if (!url) return new NextResponse('Not found', { status: 404 });
  return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } });
}
