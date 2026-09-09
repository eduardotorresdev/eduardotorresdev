<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { homeAnchor, localeFile, t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
	const entry = $derived(data.entry);
	const Body = $derived(data.body);
</script>

<Seo
	{locale}
	title={entry.meta.title}
	description={entry.meta.summary}
	type="article"
	image={entry.meta.cover ?? `/og/${localeFile[locale]}/projetos/${entry.slug}.png`}
/>

<article class="container project">
	<header class="head">
		<a class="back" href={homeAnchor(locale, 'projetos')}>← {d.nav.projects}</a>
		<p class="eyebrow">{d.projectMeta.type[entry.meta.type]} · {entry.meta.year}</p>
		<h1>{entry.meta.title}</h1>
		<p class="summary">{entry.meta.summary}</p>
		{#if entry.meta.link}
			<a class="button" href={entry.meta.link} target="_blank" rel="noopener">
				{d.projectMeta.open}
				<Icon name="external" size={18} />
			</a>
		{/if}
	</header>
	<Body />
</article>

<style>
	.project {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-4);
		justify-items: start;
	}
	.back {
		font-weight: var(--w-regular);
		text-decoration: none;
	}
	h1 {
		font-size: var(--fs-2xl);
		max-width: 16ch;
	}
	.summary {
		font-size: var(--fs-lg);
		max-width: var(--measure);
	}
</style>
