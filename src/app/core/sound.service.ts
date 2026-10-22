import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const SOUND_STORAGE_KEY = 'sound';

/** Open strings of a guitar in standard tuning, low E to high E, in Hz. */
export const STANDARD_TUNING = [
  { name: 'E', octave: 2, hz: 82.41 },
  { name: 'A', octave: 2, hz: 110.0 },
  { name: 'D', octave: 3, hz: 146.83 },
  { name: 'G', octave: 3, hz: 196.0 },
  { name: 'B', octave: 3, hz: 246.94 },
  { name: 'E', octave: 4, hz: 329.63 },
] as const;

/**
 * Plucked-string sounds, synthesised with the Karplus–Strong algorithm (no audio files).
 * Off by default; the visitor turns it on and the choice is remembered.
 */
@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private context: AudioContext | null = null;
  private readonly buffers = new Map<number, AudioBuffer>();

  readonly enabled = signal(false);

  constructor() {
    if (!this.isBrowser) return;
    try {
      this.enabled.set(localStorage.getItem(SOUND_STORAGE_KEY) === 'on');
    } catch {
      // Storage can be blocked; sound simply starts off.
    }
  }

  toggle(): void {
    const on = !this.enabled();
    this.enabled.set(on);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      // The choice still applies for this visit.
    }
    if (on) this.pluck(STANDARD_TUNING[5].hz, 0.6);
  }

  /**
   * Plays a plucked string at `hz` if sound is on. Safe to call on every hover.
   * `force` plays it anyway, for sounds the visitor explicitly asked for (tuner reference notes).
   */
  pluck(hz: number, volume = 0.35, force = false): void {
    if (!this.isBrowser || (!this.enabled() && !force)) return;
    const ctx = this.audio();
    if (!ctx) return;

    const source = ctx.createBufferSource();
    source.buffer = this.buffer(ctx, hz);
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(ctx.destination);
    source.start();
  }

  private audio(): AudioContext | null {
    if (!this.context) {
      const Ctor = window.AudioContext;
      if (!Ctor) return null;
      this.context = new Ctor();
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  private buffer(ctx: AudioContext, hz: number): AudioBuffer {
    const key = Math.round(hz * 100);
    let buffer = this.buffers.get(key);
    if (!buffer) {
      buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.6), ctx.sampleRate);
      karplusStrong(buffer.getChannelData(0), ctx.sampleRate, hz);
      this.buffers.set(key, buffer);
    }
    return buffer;
  }
}

/**
 * Fills `out` with a plucked string: a burst of noise in a delay line as long as one period,
 * repeatedly averaged so the high harmonics die out first, the way a real string's do.
 */
export function karplusStrong(
  out: Float32Array,
  sampleRate: number,
  hz: number,
  decay = 0.996,
): void {
  const period = Math.max(2, Math.round(sampleRate / hz));
  const line = new Float32Array(period);
  for (let i = 0; i < period; i++) line[i] = Math.random() * 2 - 1;

  let idx = 0;
  for (let i = 0; i < out.length; i++) {
    const next = (idx + 1) % period;
    const sample = line[idx];
    line[idx] = decay * 0.5 * (sample + line[next]);
    out[i] = sample;
    idx = next;
  }
}
