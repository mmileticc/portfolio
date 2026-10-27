---
title: Building my portfolio as a songbook
date: 2026-10-22
summary: Why this site looks like a songbook on a spruce guitar top, why it started as a pedalboard, and how it is put together with Angular and static prerendering.
tags: [angular, design, this-site]
---

Most developer portfolios look the same: a dark background, a fake terminal, a grid of identical
cards. My previous one was exactly that. It said nothing about me, so I started over.

## From a pedalboard to a songbook

I play acoustic and classical guitar, and lately the harmonica, and a lot of what I build ends up
near music ([GotH](/projects/goth) started as a tool for myself). The first version of this site
was a guitar pedalboard, with every project as an effects pedal. It looked great, but I have never
actually used a pedal, so it wasn't really me.

A songbook is. Every project is now a song with its own page: a title, a style, and its main
technologies written as chord boxes. Open one and you get a plain write-up: the problem, how it's
built, what it does and the stack.

A few details I enjoyed building:

- **Strings you can strum.** The dividers between sections are six real strings. Brush over them
  and they vibrate; turn the sound on in the navigation and they ring at their actual pitch,
  synthesised in the browser with the Karplus–Strong algorithm. No audio files.
- **A tuning peg** switches between the light spruce theme and the dark rosewood one.
- **A tuner.** There is a small chromatic tuner hidden on the site, in honour of my
  [Android tuner](https://github.com/mmileticc/Android-Guitar-Tuner). It listens to the
  microphone only after you ask it to.

## How it is built

- **Angular 22** with standalone components, signals and no Zone.js.
- **Static prerendering**: every route, including each project and each post, is rendered to
  plain HTML at build time, so it is fast and works on GitHub Pages without a server.
- **Content at build time**: posts are Markdown files and a small script turns them into
  TypeScript, together with a snapshot of my GitHub repositories. The browser then refreshes the
  GitHub part live, and falls back to the snapshot if the API is unavailable.

The plucked string is surprisingly little code. A burst of noise goes into a delay line one period
long, and every pass averages neighbouring samples, so the high harmonics fade first, just like on
a real string:

```ts
const period = Math.round(sampleRate / hz);
const line = new Float32Array(period).map(() => Math.random() * 2 - 1);

let idx = 0;
for (let i = 0; i < out.length; i++) {
  const next = (idx + 1) % period;
  out[i] = line[idx];
  line[idx] = decay * 0.5 * (line[idx] + line[next]);
  idx = next;
}
```

## What is next

More posts about the things I build, mostly Kotlin, Android and the web.
