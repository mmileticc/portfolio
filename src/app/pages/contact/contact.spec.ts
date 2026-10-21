import { TestBed } from '@angular/core/testing';
import { joinEmail } from '../../core/email';
import Contact, { MIN_FILL_MS } from './contact';

async function setup() {
  const fixture = TestBed.createComponent(Contact);
  await fixture.whenStable(); // runs afterNextRender, which starts the fill timer
  const contact = fixture.componentInstance;
  contact['form'].setValue({
    name: 'Ana',
    email: 'ana@example.com',
    message: 'Hello, I liked the pedals!',
    _gotcha: '',
  });
  return contact;
}

describe('Contact form spam guards', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  const start = Date.parse('2026-10-22T10:00:00Z');

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(start);
    fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
  });

  afterEach(() => vi.restoreAllMocks());

  it('sends a message written at human speed', async () => {
    const contact = await setup();
    vi.spyOn(Date, 'now').mockReturnValue(start + MIN_FILL_MS + 1000);

    await contact['send']();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(contact['state']()).toBe('sent');
  });

  it('silently drops a form submitted too fast', async () => {
    const contact = await setup();
    vi.spyOn(Date, 'now').mockReturnValue(start + 500);

    await contact['send']();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(contact['state']()).toBe('sent');
  });

  it('silently drops a form with the honeypot filled', async () => {
    const contact = await setup();
    contact['form'].controls._gotcha.setValue('http://spam.example');
    vi.spyOn(Date, 'now').mockReturnValue(start + MIN_FILL_MS + 1000);

    await contact['send']();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(contact['state']()).toBe('sent');
  });
});

describe('joinEmail', () => {
  it('joins the parts, or returns nothing when there is no user', () => {
    expect(joinEmail({ user: 'a.b', domain: 'example.com' })).toBe('a.b@example.com');
    expect(joinEmail({ user: '', domain: 'example.com' })).toBe('');
  });
});
