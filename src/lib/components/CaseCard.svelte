<script lang="ts">
	import type { Case } from '$lib/content/types';
	import { href, t, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let { entry, locale, index }: { entry: Case; locale: Locale; index: number } = $props();
	const d = $derived(t(locale));
	const url = $derived(href(locale, 'cases', entry.slug));
</script>

<article class="card block block--interactive">
	<a class="cover" href={url} tabindex="-1" aria-hidden="true">
		{#if entry.meta.cover}
			<img src={entry.meta.cover} alt="" width="800" height="500" loading="lazy" />
		{:else}
			<span class="placeholder"><span>{String(index + 1).padStart(2, '0')}</span></span>
		{/if}
	</a>
	<div class="body">
		<p class="eyebrow">{entry.meta.client} · {entry.meta.year}</p>
		<h3><a href={url}>{entry.meta.title}</a></h3>
		<p class="summary">{entry.meta.summary}</p>
		<ul class="stack" role="list">
			{#each entry.meta.stack as tech (tech)}
				<li class="tag">{tech}</li>
			{/each}
		</ul>
		<a class="more" href={url}>
			{d.caseMeta.readCase}
			<Icon name="arrow" size={18} />
		</a>
	</div>
</article>

<style>
	.card {
		display: grid;
		grid-template-rows: auto 1fr;
	}
	.cover {
		display: block;
		border-bottom: var(--border);
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--bg);
	}
	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.05);
		transition: filter 300ms var(--ease-out);
	}
	.card:hover .cover img {
		filter: grayscale(0.2);
	}
	.placeholder {
		display: grid;
		place-items: center;
		height: 100%;
		background: repeating-linear-gradient(45deg, var(--bg) 0 10px, var(--surface) 10px 20px);
	}
	.placeholder span {
		font-weight: var(--w-heavy);
		font-size: var(--fs-2xl);
		letter-spacing: -0.04em;
		background: var(--surface);
		padding: 0 0.3em;
		border: var(--border);
		box-shadow: var(--shadow-sm);
	}
	.body {
		display: grid;
		gap: var(--sp-3);
		padding: var(--sp-6);
		align-content: start;
	}
	h3 a {
		text-decoration: none;
	}
	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.card {
		position: relative;
	}
	.summary {
		color: var(--muted);
		font-weight: var(--w-regular);
	}
	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		margin-top: var(--sp-2);
		font-weight: var(--w-heavy);
		text-decoration: none;
	}
	.more :global(svg) {
		transition: transform var(--dur) var(--ease-out);
	}
	.card:hover .more :global(svg) {
		transform: translateX(4px);
	}
</style>
