// Turns pdf.js text items into per-word boxes (percent of the page) in reading order.
// Shared by the browser uploader and the back-fill script, so it must stay dependency-free.

export type WordBox = { t: string; l: number; w: number; top: number; h: number };

type TextItem = { str: string; transform: number[]; width: number; height: number };

const NARROW = /[iljtfI'’“”"!.,;:()\-]/;
const charWidth = (ch: string) => (NARROW.test(ch) ? 0.45 : ch === ' ' ? 0.55 : 1);
const measure = (s: string) => [...s].reduce((sum, c) => sum + charWidth(c), 0);

export function extractWords(items: TextItem[], pageWidth: number, pageHeight: number): { text: string; words: WordBox[] } {
  const lines = items
    .filter((it) => it.str?.trim())
    .sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);
  const words: WordBox[] = [];
  for (const it of lines) {
    const x0 = it.transform[4];
    const y = it.transform[5];
    const h = it.height || Math.abs(it.transform[3]) || 12;
    const unit = it.width / Math.max(1, measure(it.str));
    for (const m of it.str.matchAll(/\S+/g)) {
      const x = x0 + measure(it.str.slice(0, m.index)) * unit;
      const ww = measure(m[0]) * unit;
      words.push({
        t: m[0],
        l: round((x / pageWidth) * 100),
        w: round((ww / pageWidth) * 100),
        top: round(((pageHeight - (y + 0.64 * h)) / pageHeight) * 100),
        h: round(((1.0 * h) / pageHeight) * 100),
      });
    }
  }
  return { text: lines.map((l) => l.str.trim()).join(' '), words };
}

const round = (n: number) => Math.round(n * 100) / 100;
