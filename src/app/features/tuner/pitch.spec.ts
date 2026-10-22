import { karplusStrong } from '../../core/sound.service';
import { detectPitch, toNote } from './pitch';

const RATE = 44100;

function tone(hz: number, length = 4096, harmonics = [1, 0.5, 0.25]): Float32Array {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    buf[i] =
      harmonics.reduce(
        (sum, amp, h) => sum + amp * Math.sin((2 * Math.PI * hz * (h + 1) * i) / RATE),
        0,
      ) * 0.3;
  }
  return buf;
}

describe('detectPitch', () => {
  it.each([82.41, 110, 146.83, 196, 246.94, 329.63])('finds the %s Hz open string', (hz) => {
    const found = detectPitch(tone(hz), RATE)!;
    expect(Math.abs(1200 * Math.log2(found / hz))).toBeLessThan(5); // within 5 cents
  });

  it('ignores silence', () => {
    expect(detectPitch(new Float32Array(4096), RATE)).toBeNull();
  });

  it('hears a synthesised plucked string at its pitch', () => {
    const out = new Float32Array(8192);
    karplusStrong(out, RATE, 110);
    const found = detectPitch(out.subarray(2048, 2048 + 4096), RATE)!;
    expect(Math.abs(1200 * Math.log2(found / 110))).toBeLessThan(20);
  });
});

describe('toNote', () => {
  it('names the nearest note and the distance in cents', () => {
    expect(toNote(440)).toMatchObject({ name: 'A', octave: 4, cents: 0 });
    expect(toNote(82.41)).toMatchObject({ name: 'E', octave: 2 });
    const sharp = toNote(440 * 2 ** (10 / 1200));
    expect(sharp.name).toBe('A');
    expect(sharp.cents).toBe(10);
  });
});
