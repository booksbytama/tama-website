import 'dotenv/config';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

// Supabase passwords may contain characters that must be percent-encoded in a URL.
function normalise(u: string): string {
  const m = u.match(/^(postgres(?:ql)?:\/\/[^:]+:)(.*)(@[^@]+)$/);
  if (!m) return u;
  const pw = m[2];
  try {
    if (decodeURIComponent(pw) !== pw) return u;
  } catch {}
  return `${m[1]}${encodeURIComponent(pw)}${m[3]}`;
}

const sql = postgres(normalise(url), { ssl: 'require', max: 1, prepare: false });
const dir = join(process.cwd(), 'supabase', 'migrations');

async function main() {
  await sql`create table if not exists _migrations (name text primary key, applied_at timestamptz default now())`;
  const applied = new Set((await sql`select name from _migrations`).map((r) => r.name as string));
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    if (applied.has(file)) continue;
    process.stdout.write(`applying ${file}... `);
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(dir, file), 'utf8'));
      await tx`insert into _migrations (name) values (${file})`;
    });
    console.log('ok');
  }
  console.log(`${files.length} migration(s), ${files.length - applied.size} applied now`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => sql.end());
