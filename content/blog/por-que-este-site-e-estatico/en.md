---
title: Static content and +99 on Core Web Vitals
summary: A personal site with a blog serving markdown content, with i18n support.
date: 2026-09-06
tags: [story, sveltekit, performance, ssg, web vitals]
tldr:
  - 'Personal site on SvelteKit with SSG: content in markdown + frontmatter, one folder per post with a .md per language.'
  - 'Cloudflare Pages serves the static files and a Pages Function handles the contact form, with Resend and Turnstile.'
  - 'CI/CD with a p99 of 55s across check and deploy, with no server to provision.'
  - 'Core Web Vitals +99 on Lighthouse; comments, search and a CMS were deliberately left out.'
---

It had been four years since I last invested… in myself. No site of my own, a domain sitting idle, the same old story: the blacksmith's house has a wooden spit. That was true until now, but I got tired of it, picked up the anvil and the hammer, lit the forge and opened Claude.

## Where to start

Before writing a single line of code, I started by looking at what the site was for:

> "What can I deliver with this?"

The easy answer is to stop at the ego: **where I've been**, **my numbers** and **achievements**. But I wanted something more intimate, to put the wins, the failures, the lessons and the accumulated knowledge out in the open, taking inspiration from the incredible people we have in computing and software in general: [Luciano Souza](https://www.linkedin.com/in/lucianodiisouza/), [Bruno Bertolini](https://www.linkedin.com/in/brunobertolini/), [Filipe Deschamps](https://www.linkedin.com/in/filipedeschamps/) and [Karol Attekita](https://www.linkedin.com/in/bullas-attekita/), who contribute a lot to our field and always bring incredible projects and lessons. And even today, with AI everywhere, those exchanges are and always will be essential.

> "Exchanging information and experience is what moves us every day"

After chewing on all of that, I made up my mind. Beyond introducing myself, I need to deliver something relevant to other people. I didn't get here on my own — there's an army of people who contributed in some way behind the things I do every day, and giving back is the least I can do.

So I decided to publish:

- **Cases**: work I've delivered, with the challenges, solutions and results of the projects I've worked on.
- **Projects**: software, open-source tools or articles I built or took part in, contributing to the industry and to academia.
- **Blog**: where I publish lessons, failures, opinions, experiments, prototypes and guides — almost like a diary.
- **Contact**: a way to reach me, whether to chat, for mentoring or project ideas. I answer in under 8 minutes; it lands straight in my inbox.
- **About**: a bit of my story, the places I've been, what I've achieved and what these 8 years have taught me.

## Built in under 2 days

To build the site I used Claude Opus for the implementation and Fable to help me craft the experience. That took me from sketch to a site running in production in record time.

It was a fascinating process: at the same time as I dictated a number of decisions, the agents pointed out flaws in some of them and helped me uncover the trade-offs in certain situations. So beyond speeding up the operational side of these ideas, it was a learning journey too.

## Technologies

The next step was the technical part: how to actually deliver the content.

### SvelteKit

Aiming for lightness and fast iteration during development, I chose SvelteKit. On top of **CSR** (Client Side Rendering) and **SSR** (Server Side Rendering), it ships **SSG** (Static Site Generation) natively.

For styling I decided to go with plain CSS — no build step, no Tailwind overhead for a site this simple.

### Cloudflare Pages + Functions

I had already tried this pair on a few small projects and it worked out great.

CF Pages serves our static assets, delivering the site without provisioning a server, and for free, with the N benefits it offers, like native analytics and performance metrics.

CF Pages Functions is there basically to run the email-sending function that makes the contact form work.

With that, the CI/CD process landed at a p99 of 55s, including check and deploy.

| Metric       | `check` | `deploy` | Total (jobs) |
| ------------ | ------: | -------: | -----------: |
| p50 (median) |     27s |    21.5s |        48.5s |
| p99 ≈ max    | **28s** |  **23s** |      **55s** |
| min          |     24s |      17s |          41s |

Worth remembering that other solutions could have been used — GitHub Pages, Deno Deploy, Supabase — with similar results. Cloudflare was pure convenience: my domain was already configured there, so I could serve the site and deploy the function in the same place, taking advantage of everything on offer.

### Resend

While I was at it, I decided to use Resend to receive the messages from the site.

For the very low email volume expected, the free tier is more than enough, not to mention how fast the emails go out and how absurdly simple it is to configure — a piece of cake.

That's what lets me reply to incoming emails within 5 minutes.

### Turnstile

To round off the stack, I had already considered an anti-spam system for the form, but I wasn't sure which flavour I wanted.

As everyone knows, or has probably run into, CF also offers a recaptcha/anti-spam service: Turnstile. Since I was already using Pages and Functions, the choice was obvious. It was painless to configure too — sorted in 5 minutes — and it's frictionless.

## Content in markdown

It sounds counterintuitive to talk about a blog, for example, and serve a static site.

Even so, thinking about posting frequency, deploy cost and the pursuit of simplicity, posts and cases could be structured as markdown + frontmatter. That gives us a standard structure for these kinds of content, with cheap rendering and easy writing.

A post's frontmatter carries only what the listing, the SEO and the page header need:

```yaml
---
title: Static content and +99 on Core Web Vitals
summary: A personal site with a blog serving markdown content, with i18n support.
date: 2026-09-06
tags: [story, sveltekit, performance, ssg, web vitals]
tldr:
  - 'Personal site on SvelteKit with SSG: content in markdown + frontmatter.'
  - 'Cloudflare Pages serves the static files and a Pages Function handles the contact form.'
---
```

A case swaps date and tags for the facts of the project, which become the spec sheet at the top of the page:

```yaml
---
title: Live coverage that earns more
summary: New interaction and content-consumption patterns for G1 and GE live coverage.
client: Grupo Globo
year: 2024
role: Front-end developer, tech lead
stack: [TypeScript, React, Micro-frontends, A/B testing, Core Web Vitals]
featured: true
order: 1
tldr:
  - 'G1 and GE live coverage format, with millions of people on the same page at the same time.'
  - '+24% ad revenue, with Core Web Vitals in the green.'
---
```

Both shapes are typed in TypeScript, so a missing required field or a misspelled name breaks on `check`, before it ever becomes a deploy. `tldr` is optional and turns into that summary block back at the top of this post.

Finally, I only had to solve i18n. For that, it's enough to have one .md per language — in this case only pt-br and en. Each post and case is a folder with one file per language:

```
content/
  blog/
    por-que-este-site-e-estatico/
      pt-br.md
      en.md
  cases/
    cobertura-ao-vivo-globo/
      pt-br.md
      en.md
```

The slug is the folder name, the same in both languages.

So every time I need to write a new post, or even a case, I write the markdown, add images, fill in the content, save, commit + push and it cuts a release. Publishing 3 posts a week, we'd spend at most 11 minutes of GitHub Actions CI/CD quota — irrelevant.

## Core Web Vitals

Taking advantage of the site's simplicity and its static content, I ran several iterations optimising the images and assets to deliver the best possible Core Web Vitals.

> On a site this size, static, Core Web Vitals +99 is the bare minimum

<figure>
  <img
    src="/img/blog/por-que-este-site-e-estatico/webvitals.webp"
    alt="Lighthouse report scoring 100 on performance, accessibility, best practices and SEO"
    width="970"
    height="372"
    loading="lazy"
  />
  <figcaption>Lighthouse running on eduardotorres.dev in production.</figcaption>
</figure>

And that was the result I got on Lighthouse.

## What was left out

Comments, search, a CMS — all still irrelevant for my use case. Maybe I'll add search in the future, but the simplicity we adopted will definitely stay.

## Repository

If you want to take a look at the codebase, it's public and available in this repo:

- [https://github.com/eduardotorresdev/eduardotorresdev](https://github.com/eduardotorresdev/eduardotorresdev)

**Thanks for reading — I hope it added something to your day.**
