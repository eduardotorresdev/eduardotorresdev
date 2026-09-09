<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { homeAnchor, href, localeFile, t } from '$lib/i18n';

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
	image={entry.meta.cover ?? `/og/${localeFile[locale]}/cases/${entry.slug}.png`}
	schemaKind="CreativeWork"
	breadcrumbs={[
		{ name: d.nav.cases, path: href(locale, 'cases') },
		{ name: entry.meta.title, path: href(locale, 'cases', entry.slug) }
	]}
/>

<article class="container case">
	<header class="head">
		<a class="back" href={homeAnchor(locale, 'cases')}>← {d.nav.cases}</a>
		<h1>{entry.meta.title}</h1>
		<p class="summary">{entry.meta.summary}</p>
		<dl class="facts block">
			<div>
				<dt>{d.caseMeta.client}</dt>
				<dd>{entry.meta.client}</dd>
			</div>
			<div>
				<dt>{d.caseMeta.year}</dt>
				<dd>{entry.meta.year}</dd>
			</div>
			<div>
				<dt>{d.caseMeta.role}</dt>
				<dd>{entry.meta.role}</dd>
			</div>
			<div>
				<dt>{d.caseMeta.stack}</dt>
				<dd class="stack">
					{#each entry.meta.stack as tech (tech)}<span class="tag">{tech}</span>{/each}
				</dd>
			</div>
			{#if entry.meta.link}
				<div>
					<dt>{d.caseMeta.link}</dt>
					<dd>
						<a href={entry.meta.link} target="_blank" rel="noopener"
							>{new URL(entry.meta.link).host} <Icon name="external" size={14} /></a
						>
					</dd>
				</div>
			{/if}
		</dl>
	</header>

	{#if entry.meta.cover}
		<img class="cover" src={entry.meta.cover} alt="" width="1400" height="800" />
	{/if}

	<Body />
</article>

<style>
	.case {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-6);
	}
	.back {
		font-weight: var(--w-regular);
		text-decoration: none;
		justify-self: start;
	}
	h1 {
		font-size: var(--fs-2xl);
		max-width: 16ch;
	}
	.summary {
		font-size: var(--fs-lg);
		max-width: var(--measure);
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: var(--sp-6);
		padding: var(--sp-6);
	}
	.facts div {
		display: grid;
		gap: var(--sp-1);
		align-content: start;
	}
	dt {
		font-size: var(--fs-xs);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		font-weight: var(--w-regular);
	}
	dd {
		font-weight: var(--w-regular);
	}
	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-1);
	}
	dd a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.cover {
		width: 100%;
		border: var(--border);
		box-shadow: var(--shadow-lg);
		filter: grayscale(1);
	}
</style>
