import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/seo.service';
import { injectEmail } from '../../core/email';
import { Led } from '../../ui/led/led';
import { GITHUB_URL, SITE } from '../../site.config';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

/** Nobody types a name, an email and a message this fast; bots that fill the page do. */
export const MIN_FILL_MS = 3000;

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Led],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Contact {
  protected readonly site = SITE;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly formEnabled = !!SITE.formspreeId;
  protected readonly state = signal<SendState>('idle');
  protected readonly email = injectEmail();
  /** When the form became usable; null until the page runs in a browser. */
  private shownAt: number | null = null;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    // Honeypot: real people never see or fill this field.
    _gotcha: [''],
  });

  constructor() {
    inject(SeoService).set({
      path: '/contact',
      title: 'Contact',
      description: 'Get in touch with Milinko Miletić about work, projects or music.',
    });
    afterNextRender(() => (this.shownAt = Date.now()));
  }

  protected showError(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.state() === 'error');
  }

  protected async send(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.formEnabled || this.state() === 'sending') return;

    // Likely a bot: pretend it worked so it has no reason to retry, but send nothing.
    if (this.looksAutomated()) {
      this.state.set('sent');
      this.form.reset();
      return;
    }

    this.state.set('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.form.getRawValue(),
          _subject: `Portfolio message from ${this.form.controls.name.value}`,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.state.set('sent');
      this.form.reset();
    } catch {
      this.state.set('error');
    }
  }

  private looksAutomated(): boolean {
    const honeypotFilled = this.form.controls._gotcha.value.trim() !== '';
    const tooFast = this.shownAt === null || Date.now() - this.shownAt < MIN_FILL_MS;
    return honeypotFilled || tooFast;
  }
}
