---
title: Building my portfolio as a pedalboard
date: 2026-10-21
summary: Why this site looks like a guitar pedalboard, and how it is put together with Angular, static prerendering and a bit of build-time content.
tags: [angular, design, this-site]
---

Most developer portfolios look the same: a dark background, a fake terminal, a grid of identical
cards. My previous one was exactly that. It said nothing about me, so I started over.

## The idea

I play guitar, and lately the harmonica, and a lot of what I build ends up near music
([GotH](/projects/goth) started as a tool for myself). A pedalboard is a nice metaphor for a
portfolio: every pedal does one thing, has its own character, and together they make a sound.

So the projects are pedals. Each one has an enclosure colour, three knobs for its main
technologies and a footswitch. Stomp on one and you get its manual: what it does, the signal flow,
the controls and the specs. Even the light/dark switch in the navigation is a footswitch.

## How it is built

- **Angular 22** with standalone components, signals and no Zone.js.
- **Static prerendering**: every route, including each project and each post, is rendered to
  plain HTML at build time, so it is fast and works on GitHub Pages without a server.
- **Content at build time**: posts are Markdown files and a small script turns them into
  TypeScript, together with a snapshot of my GitHub repositories. The browser then refreshes the
  GitHub part live, and falls back to the snapshot if the API is unavailable.

The knobs are real enough to be fun. A value from 0 to 10 maps to the pointer angle the way a
potentiometer does, and the volume knob on the amp on the home page goes to 11:

```ts
/** 0 → -135°, 10 → +135°, like a real pot. */
protected angle(): number {
  const v = Math.min(11, Math.max(0, this.value()));
  return -135 + v * 27;
}
```

## What is next

More posts about the things I build, mostly Kotlin, Android and the web. And maybe a small tuner
hidden somewhere on this site.
