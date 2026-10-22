const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export interface NoteReading {
  /** e.g. "A" */
  name: string;
  octave: number;
  /** -50…+50: how far the pitch is from that note. */
  cents: number;
  hz: number;
}

/**
 * Estimates the fundamental frequency of a mono signal by autocorrelation, or returns null
 * for silence or noise. Good for a single guitar string (about 70–1000 Hz).
 */
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  let rms = 0;
  for (const v of buf) rms += v * v;
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.01) return null;

  const minLag = Math.floor(sampleRate / 1000);
  const maxLag = Math.min(Math.floor(sampleRate / 60), buf.length - 1);
  const n = buf.length - maxLag;

  const corr = new Float32Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += buf[i] * buf[i + lag];
    corr[lag] = sum;
  }

  // The first lag whose correlation is close to the strongest one is the period;
  // taking the first (not the global maximum) avoids octave errors.
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) best = Math.max(best, corr[lag]);
  if (best <= 0) return null;

  let lag = minLag;
  while (
    lag < maxLag &&
    !(corr[lag] > 0.9 * best && corr[lag] >= corr[lag - 1] && corr[lag] >= corr[lag + 1])
  ) {
    lag++;
  }
  if (lag >= maxLag) return null;

  // Parabolic interpolation around the peak for sub-sample precision.
  const a = corr[lag - 1];
  const b = corr[lag];
  const c = corr[lag + 1];
  const shift = (a - c) / (2 * (a - 2 * b + c)) || 0;
  return sampleRate / (lag + shift);
}

/** The nearest equal-tempered note (A4 = 440 Hz) and the distance to it in cents. */
export function toNote(hz: number): NoteReading {
  const midi = Math.round(69 + 12 * Math.log2(hz / 440));
  const noteHz = 440 * 2 ** ((midi - 69) / 12);
  return {
    name: NOTE_NAMES[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    cents: Math.round(1200 * Math.log2(hz / noteHz)),
    hz,
  };
}
