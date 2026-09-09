---
title: Why this site is static
summary: Markdown in the repo, build on Cloudflare, zero servers. The reasoning behind this site's stack.
date: 2026-09-06
tags: [story, sveltekit, architecture]
---

Every developer rebuilds their personal site every two years. This is my turn, and this time I decided to write down the why before I forget.

## Content in markdown

Each post and case is a folder with one file per language:

```
content/
  blog/
    why-this-site-is-static/
      pt-br.md
      en.md
```

The slug is the folder name, the same in both languages. No URL translation mapping.

## Static build

With content in the repo, there's no reason to run a server. SvelteKit pre-renders everything to HTML at build time and Cloudflare serves it from the edge.

```ts
export const prerender = true;
```

The only dynamic bit is the contact form, which hits a Pages Function.

## What was left out

Comments, search, a CMS. All of that is weight for a blog with no posts yet. If it's ever missed, it goes in.
