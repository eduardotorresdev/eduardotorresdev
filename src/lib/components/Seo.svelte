<script lang="ts">
	import { page } from '$app/state';
	import { alternatePath, locales, localeFile, t, type Locale } from '$lib/i18n';
	import { site } from '$lib/site';

	interface Props {
		locale: Locale;
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article';
		publishedAt?: string;
	}

	let { locale, title, description, image, type = 'website', publishedAt }: Props = $props();

	const alternateFor = (alt: Locale) => alternatePath(page, alt);

	const d = $derived(t(locale));
	const fullTitle = $derived(title ? `${title} · ${site.name}` : `${site.name} · ${d.hero.tagline}`);
	const desc = $derived(description ?? d.meta.description);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const ogImage = $derived(new URL(image ?? `/og/${localeFile[locale]}/site/index.png`, site.url).href);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	<link rel="canonical" href={canonical} />
	{#each locales as alt (alt)}
		<link rel="alternate" hreflang={alt} href={new URL(alternateFor(alt), site.url).href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={new URL(alternateFor('pt-BR'), site.url).href} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={d.meta.locale} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	{#if publishedAt}
		<meta property="article:published_time" content={publishedAt} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
