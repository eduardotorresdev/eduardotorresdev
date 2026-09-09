---
title: Por que este site é estático
summary: Markdown no repositório, build na Cloudflare, zero servidor. O raciocínio por trás da stack deste site.
date: 2026-09-06
tags: [relato, sveltekit, arquitetura]
---

Todo dev refaz o site pessoal a cada dois anos. Este é o meu turno, e dessa vez resolvi escrever o porquê das escolhas antes de esquecer.

## Conteúdo em markdown

Cada post e case é uma pasta com um arquivo por idioma:

```
content/
  blog/
    por-que-este-site-e-estatico/
      pt-br.md
      en.md
```

O slug é o nome da pasta, igual nos dois idiomas. Nada de mapear tradução de URL.

## Build estático

Com o conteúdo no repositório, não existe motivo pra ter servidor. O SvelteKit pré-renderiza tudo em HTML no build e a Cloudflare serve da borda.

```ts
export const prerender = true;
```

O único ponto dinâmico é o formulário de contato, que cai numa Pages Function.

## O que ficou de fora

Comentários, busca, CMS. Tudo isso é peso pra um blog que ainda não tem posts. Se um dia fizer falta, entra.
