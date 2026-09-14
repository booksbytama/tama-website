// Absolute origin of the site. Accepts NEXT_PUBLIC_APP_URL with or without a
// scheme, falls back to Vercel's deployment URL, then localhost.
export function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withScheme);
}
