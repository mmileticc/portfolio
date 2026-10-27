import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { STANDARD_TUNING, SoundService } from '../../core/sound.service';
import { NoteReading, detectPitch, toNote } from './pitch';
import { TunerService } from './tuner.service';

type Status = 'idle' | 'starting' | 'listening' | 'denied' | 'unsupported';

/** A chromatic tuner in a dialog: listens to the microphone only after the visitor asks. */
@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.html',
  styleUrl: './tuner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tuner {
  private readonly tuner = inject(TunerService);
  private readonly sound = inject(SoundService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly strings = STANDARD_TUNING;
  protected readonly status = signal<Status>('idle');
  protected readonly reading = signal<NoteReading | null>(null);
  protected readonly inTune = computed(() => {
    const r = this.reading();
    return !!r && Math.abs(r.cents) <= 5;
  });
  /** Needle angle: ±50 cents maps to ±45°. */
  protected readonly needle = computed(() => (this.reading()?.cents ?? 0) * 0.9);

  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private frame = 0;

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.tuner.isOpen() && !el.open) el.showModal();
      if (!this.tuner.isOpen() && el.open) el.close();
    });
    inject(DestroyRef).onDestroy(() => this.stopListening());
  }

  protected close(): void {
    this.stopListening();
    this.tuner.close();
  }

  protected playReference(hz: number): void {
    this.sound.pluck(hz, 0.5, true);
  }

  protected async start(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      this.status.set('unsupported');
      return;
    }
    this.status.set('starting');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      this.status.set('denied');
      return;
    }

    this.context = new AudioContext();
    const analyser = this.context.createAnalyser();
    analyser.fftSize = 4096;
    this.context.createMediaStreamSource(this.stream).connect(analyser);
    this.status.set('listening');

    const buf = new Float32Array(analyser.fftSize);
    let smoothed: number | null = null;
    const tick = () => {
      analyser.getFloatTimeDomainData(buf);
      const hz = detectPitch(buf, this.context!.sampleRate);
      if (hz) {
        // Light smoothing keeps the needle readable without lagging behind a new string.
        smoothed =
          smoothed && Math.abs(hz - smoothed) / smoothed < 0.06 ? smoothed * 0.7 + hz * 0.3 : hz;
        this.reading.set(toNote(smoothed));
      }
      this.frame = requestAnimationFrame(tick);
    };
    tick();
  }

  private stopListening(): void {
    cancelAnimationFrame(this.frame);
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.context?.close();
    this.stream = null;
    this.context = null;
    this.reading.set(null);
    if (this.status() === 'listening' || this.status() === 'starting') this.status.set('idle');
  }
}
