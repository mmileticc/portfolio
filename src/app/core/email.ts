import { Signal, afterNextRender, signal } from '@angular/core';
import { SITE } from '../site.config';

export function joinEmail(email: { user: string; domain: string } = SITE.email): string {
  return email.user ? `${email.user}@${email.domain}` : '';
}

/**
 * The contact address, available only in the browser after the first render. Prerendered HTML
 * never contains it, which keeps it away from scrapers that harvest emails from static pages.
 * Call from a component's injection context.
 */
export function injectEmail(): Signal<string> {
  const address = signal('');
  afterNextRender(() => address.set(joinEmail()));
  return address.asReadonly();
}
