import 'server-only';

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
export async function synthesizeWords(words: string[], voice: NarrationVoice, rate = 0.95): Promise<{ mp3: Buffer; timings: number[] }> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY is not set');
  const ssml = `<speak>${words.map((w, i) => `<mark name="w${i}"/>${esc(w)}`).join(' ')}</speak>`;
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
