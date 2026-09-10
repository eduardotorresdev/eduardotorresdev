# eduardotorres.dev

Site pessoal de Eduardo Torres. SvelteKit 2 + Svelte 5 (runes), TypeScript, CSS puro, conteúdo em
markdown, build 100% estático na Cloudflare Pages. Bilíngue: pt-BR na raiz, inglês em `/en`.

## Comandos

```bash
cp .env.example .env   # PUBLIC_TURNSTILE_SITE_KEY precisa existir pro `svelte-kit sync`
bun install
bun run dev            # vite dev
bun run build          # gera ./build (adapter-static)
bun run preview
bun run check          # svelte-check + tsc das functions
bun run lint           # oxlint
bun run format         # prettier --write
bun run test           # vitest (só lógica, sem DOM)
```

CI (GitHub Actions, `.github/workflows/ci.yml`) roda lint, format:check, check, test e build a cada
push e PR. No push pra `main` o job `deploy` publica o `build/` no projeto Cloudflare Pages
`eduardotorresdev` com `bun run deploy` (`wrangler pages deploy`, direct upload — não há integração
Pages ↔ GitHub). As Pages Functions de `functions/` são detectadas pelo wrangler na raiz do repo.

Segredos do repositório usados pelo deploy: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; e a
variable `PUBLIC_TURNSTILE_SITE_KEY`.

## Estrutura

```
content/                  markdown, fora do src
  blog/<slug>/{pt-br,en}.md
  cases/<slug>/{pt-br,en}.md
  projetos/<slug>/{pt-br,en}.md
functions/api/contact.ts  Pages Function do formulário (Resend + Turnstile)
src/
  hooks.ts                reroute: /en/about → /en/sobre
  hooks.server.ts         injeta <html lang>
  params/lang.ts          matcher do prefixo de idioma
  lib/
    i18n/                 locales, rotas traduzidas, dicionários pt-br.ts / en.ts
    content/              loader dos .md (index.ts = metadados, body.ts = componente)
    components/           componentes Svelte; content/ = os disponíveis dentro do markdown
    styles/               tokens.css, reset.css, global.css
    server/og.ts          gerador de imagem Open Graph (satori + resvg)
    site.ts               URL, e-mail, redes
    about.ts              conteúdo da página /sobre
  routes/
    [[lang=lang]]/        todas as páginas; param opcional = idioma
    og/[lang]/[type]/[slug].png
    sitemap.xml
static/                   fontes, imagens, _redirects, _headers
tests/                    vitest
```

## Regras de código

- **Identificadores em inglês, comentários e docs em português.**
- **Svelte 5 com runes.** `$props()` tipado, `$state`, `$derived`. Nunca `export let`, nunca stores
  pra estado local. Um componente por arquivo em `src/lib/components`.
- **CSS puro.** Só custom properties (ver `tokens.css`) e `<style>` escopado do componente.
  Sem Tailwind, sem preprocessor, sem CSS-in-JS, sem BEM. Classes com nome semântico curto.
  Utilitários globais existem só em `global.css` (`.container`, `.block`, `.button`, `.tag`, `.prose`, `.eyebrow`).
- **Sem lib de UI, sem lib de ícones, sem lib de animação.** Ícones são SVG inline em `Icon.svelte`.
  Animação é CSS (`transition`, `@keyframes`) ou transição nativa do Svelte. Respeitar
  `prefers-reduced-motion`.
- **Direção de arte:** fundo off-white `--bg`, tinta `--ink`, hard shadow sem blur (`--shadow-md`),
  fonte Bricolage Grotesque variável: 800 nos headings, 300/400 no corpo. Monocromático, sem cor de acento.
- **Conteúdo:** todo post/case/projeto existe nos dois idiomas, mesmo slug (nome da pasta).
  Projeto sem corpo (só frontmatter) linka direto pro `link` externo; com corpo ganha `/projetos/<slug>`.
  Frontmatter tipado em `src/lib/content/types.ts`. Post e case aceitam `tldr` (string ou lista de
  strings), renderizado antes do corpo pelo `Tldr.svelte`. Dentro do markdown, `<Gallery>` e `<Placeholder>`
  estão disponíveis sem import (ver `ContentLayout.svelte`).
- **i18n:** strings de interface só via `t(locale)`. `pt-br.ts` é a fonte; `en.ts` é `Dictionary`, então
  chave faltando quebra o type-check. URLs sempre por `href()` / `homeAnchor()`, nunca string na mão.
- **Prerender:** tudo é estático (`prerender = true` no layout raiz). Rota dinâmica precisa exportar
  `entries`. Nada de `+server.ts` que dependa de request em runtime; isso vai pra `functions/`.
- **Testes:** só lógica pura (i18n, loaders, helpers) com Vitest. Sem teste de DOM, sem Playwright.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `content:` pra posts/cases).

## Variáveis de ambiente

- `PUBLIC_TURNSTILE_SITE_KEY` (build): chave pública do Turnstile; vazia desliga o widget.
- Só na Cloudflare (runtime da function, projeto Pages `eduardotorresdev`): `RESEND_API_KEY`,
  `CONTACT_TO`, `CONTACT_FROM`, `TURNSTILE_SECRET`. Configuradas via API; não versionadas.
