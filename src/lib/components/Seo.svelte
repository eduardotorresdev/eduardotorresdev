<script lang="ts">
	import { page } from '$app/state';
	import { alternatePath, href, isHomePath, locales, localeFile, t, type Locale } from '$lib/i18n';
	import {
		articleSchema,
		breadcrumbSchema,
		graph,
		personSchema,
		safeJsonLd,
		websiteSchema,
		type Crumb,
		type JsonLd
	} from '$lib/seo/schema';
	import { site } from '$lib/site';

	interface Props {
		locale: Locale;
		title?: string;
		description?: string;
		/** Caminho ou URL da imagem de compartilhamento. Sem ela, usa o card da página se houver, senão o do site. */
		image?: string;
		type?: 'website' | 'article';
		publishedAt?: string;
		/** Tags do post: viram `article:tag` e `keywords` no JSON-LD. */
		tags?: string[];
		/** Trilha até a página, sem a home (ela entra sozinha). */
		breadcrumbs?: Crumb[];
		/** `BlogPosting` pra post, `CreativeWork` pra case e projeto. Só com `type="article"`. */
		schemaKind?: 'BlogPosting' | 'CreativeWork';
		/** Tira a página do índice (listas finas, como as de tag). */
		noindex?: boolean;
	}

	let {
		locale,
		title,
		description,
		image,
		type = 'website',
		publishedAt,
		tags = [],
		breadcrumbs = [],
		schemaKind = 'BlogPosting',
		noindex = false
	}: Props = $props();

	const alternateFor = (alt: Locale) => alternatePath(page, alt);
	const absolute = (path: string) => new URL(path, site.url).href;

	const d = $derived(t(locale));
	const isHome = $derived(isHomePath(page.url.pathname));
	const fullTitle = $derived(title ? `${title} · ${site.name}` : `${site.name} · ${d.hero.tagline}`);
	const desc = $derived(description ?? d.meta.description);
	const canonical = $derived(absolute(page.url.pathname));
	const ogImage = $derived(absolute(image ?? `/og/${localeFile[locale]}/site/index.png`));
	const ogImageAlt = $derived(title ? `${title} · ${site.name}` : d.meta.imageAlt);
	const otherLocales = $derived(locales.filter((l) => l !== locale));
	const rssHref = $derived(absolute(href(locale, undefined, 'rss.xml')));

	const jsonLd = $derived.by(() => {
		// A Person entra em toda página: é o autor referenciado por @id nos artigos.
		const nodes: JsonLd[] = [personSchema(d.meta.jobTitle)];
		if (isHome) nodes.push(websiteSchema(locale, desc));
		if (type === 'article') {
			nodes.push(
				articleSchema({
					locale,
					path: page.url.pathname,
					title: title ?? fullTitle,
					description: desc,
					image: ogImage,
					publishedAt,
					tags,
					kind: schemaKind
				})
			);
		}
		if (breadcrumbs.length) {
			nodes.push(breadcrumbSchema([{ name: d.nav.home, path: href(locale) }, ...breadcrumbs]));
		}
		return safeJsonLd(graph(nodes));
	});
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	<meta name="author" content={site.name} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}
	<link rel="canonical" href={canonical} />
	{#each locales as alt (alt)}
		<link rel="alternate" hreflang={alt} href={absolute(alternateFor(alt))} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={absolute(alternateFor('pt-BR'))} />
	<link rel="alternate" type="application/rss+xml" title="{site.name} · {d.nav.blog}" href={rssHref} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={d.meta.locale} />
	{#each otherLocales as alt (alt)}
		<meta property="og:locale:alternate" content={t(alt).meta.locale} />
	{/each}
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogImageAlt} />
	{#if type === 'article'}
		<meta property="article:author" content={site.url} />
		{#if publishedAt}
			<meta property="article:published_time" content={publishedAt} />
		{/if}
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={ogImageAlt} />
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
