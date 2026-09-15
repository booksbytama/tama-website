export const NARRATION_VOICES = [
  { id: 'en-AU-Neural2-A', label: 'Voice A · female' },
  { id: 'en-AU-Neural2-C', label: 'Voice C · female' },
  { id: 'en-AU-Neural2-B', label: 'Voice B · male' },
  { id: 'en-AU-Neural2-D', label: 'Voice D · male' },
] as const;
export type NarrationVoice = (typeof NARRATION_VOICES)[number]['id'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Synthesises `words` as one utterance with an SSML mark before each word, returning MP3 bytes
// and the start time (seconds) of every word. Only Neural2/WaveNet voices honour marks.
export type Pronunciations = Record<string, string>; // normalised word -> "sounds like" or /IPA/

export const normaliseWord = (w: string) => w.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');

// Keeps surrounding punctuation/quotes outside the substitution so pauses still trigger.
function renderWord(w: string, dict: Pronunciations): string {
  const core = normaliseWord(w);
  const say = dict[core];
  if (!say) return esc(w);
  const start = w.search(/[a-zA-Z0-9']/);
  const end = w.length - [...w].reverse().join('').search(/[a-zA-Z0-9']/);
  const lead = w.slice(0, Math.max(0, start));
  const body = w.slice(Math.max(0, start), end);
  const tail = w.slice(end);
  const ipa = say.match(/^\/(.+)\/$/);
  const inner = ipa ? `<phoneme alphabet="ipa" ph="${esc(ipa[1])}">${esc(body)}</phoneme>` : `<sub alias="${esc(say)}">${esc(body)}</sub>`;
  return `${esc(lead)}${inner}${esc(tail)}`;
}

export async function synthesizeWords(words: string[], voice: NarrationVoice, dict: Pronunciations = {}, rate = 0.95): Promise<{ mp3: Buffer; timings: number[] }> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY is not set');
  // A beat after each sentence and a shorter one after commas, so kids can take the picture in.
  const pause = (w: string) => (/[.!?…][”"’')\]]*$/.test(w) ? '<break time="550ms"/>' : /[,;:][”"’')\]]*$/.test(w) ? '<break time="180ms"/>' : '');
  const ssml = `<speak>${words.map((w, i) => `<mark name="w${i}"/>${renderWord(w, dict)}${pause(w)}`).join(' ')}</speak>`;
  const res = await fetch(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${key}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      input: { ssml },
      voice: { languageCode: 'en-AU', name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: rate },
      enableTimePointing: ['SSML_MARK'],
    }),
  });
  const json = (await res.json()) as { audioContent?: string; timepoints?: { markName: string; timeSeconds: number }[]; error?: { message: string } };
  if (!res.ok || !json.audioContent) throw new Error(json.error?.message ?? `TTS failed (${res.status})`);
  const byMark = new Map((json.timepoints ?? []).map((t) => [t.markName, t.timeSeconds]));
  const timings = words.map((_, i) => byMark.get(`w${i}`) ?? (i === 0 ? 0 : -1));
  // Fill any missing mark by interpolating from neighbours.
  for (let i = 1; i < timings.length; i++) if (timings[i] < 0) timings[i] = timings[i - 1] + 0.3;
  return { mp3: Buffer.from(json.audioContent, 'base64'), timings };
}
