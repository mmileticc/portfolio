import { Injectable, signal } from '@angular/core';

/** Opens the tuner from anywhere; the tuner itself is loaded only when first opened. */
@Injectable({ providedIn: 'root' })
export class TunerService {
  readonly isOpen = signal(false);
  /** Becomes true on the first open and stays true, so the lazy chunk loads once. */
  readonly loaded = signal(false);

  open(): void {
    this.loaded.set(true);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
