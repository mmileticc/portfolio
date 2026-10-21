import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/seo.service';
import { Led } from '../../ui/led/led';
import { GITHUB_URL, SITE } from '../../site.config';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

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

    this.state.set('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.state.set('sent');
      this.form.reset();
    } catch {
      this.state.set('error');
    }
  }
}
