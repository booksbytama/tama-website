import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { supabaseAdmin } from '@/lib/supabase/admin';

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    first_name?: string | null;
    email_addresses?: { id: string; email_address: string }[];
    primary_email_address_id?: string | null;
    public_metadata?: { role?: string };
  };
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new NextResponse('Webhook not configured', { status: 500 });

  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  let event: ClerkUserEvent;
  try {
    event = new Webhook(secret).verify(payload, headers) as unknown as ClerkUserEvent;
  } catch {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const db = supabaseAdmin();
  const { id } = event.data;

  if (event.type === 'user.deleted') {
    await db.from('users').delete().eq('clerk_id', id);
    return NextResponse.json({ ok: true });
  }

  const email = event.data.email_addresses?.find((e) => e.id === event.data.primary_email_address_id)?.email_address ?? null;
  const role = event.data.public_metadata?.role === 'admin' ? 'admin' : 'parent';
  const { error } = await db
    .from('users')
    .upsert({ clerk_id: id, email, display_name: event.data.first_name ?? email?.split('@')[0] ?? null, role }, { onConflict: 'clerk_id' });
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
