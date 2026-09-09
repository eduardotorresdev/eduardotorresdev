<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { readingTime } from '$lib/content/reading-time';
	import { formatDate, href, localeFile, t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
	const post = $derived(data.post);
	const Body = $derived(data.body);
</script>

<Seo
	{locale}
	title={post.meta.title}
	description={post.meta.summary}
	type="article"
	publishedAt={post.meta.date}
	image={post.meta.cover ?? `/og/${localeFile[locale]}/blog/${post.slug}.png`}
/>

<article class="container post">
	<header class="head">
		<div class="meta">
			<time datetime={post.meta.date}>{formatDate(locale, post.meta.date)}</time>
			<span>{d.blogMeta.readingTime(readingTime(post.words))}</span>
		</div>
		<h1>{post.meta.title}</h1>
		<p class="summary">{post.meta.summary}</p>
		<ul class="tags" role="list">
			{#each post.meta.tags as tag (tag)}
				<li><a class="tag" href={href(locale, 'blog', 'tag', tag)}>{tag}</a></li>
			{/each}
		</ul>
	</header>

	{#if post.meta.cover}
		<img class="cover" src={post.meta.cover} alt="" width="1200" height="630" />
	{/if}

	<Body />

	<nav class="adjacent" aria-label={d.nav.adjacentPosts}>
		{#if data.adjacent.previous}
			<a class="adj block block--interactive" href={href(locale, 'blog', data.adjacent.previous.slug)}>
				<span class="eyebrow">{d.blogMeta.previous}</span>
				<span class="adj-title">{data.adjacent.previous.meta.title}</span>
			</a>
		{:else}<span></span>{/if}
		{#if data.adjacent.next}
			<a class="adj adj--next block block--interactive" href={href(locale, 'blog', data.adjacent.next.slug)}>
				<span class="eyebrow">{d.blogMeta.next}</span>
				<span class="adj-title">{data.adjacent.next.meta.title}</span>
			</a>
		{/if}
	</nav>
</article>

<style>
	.post {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-4);
		max-width: 56rem;
	}
	.meta {
		display: flex;
		gap: var(--sp-4);
		color: var(--muted);
		font-weight: var(--w-regular);
	}
	h1 {
		font-size: var(--fs-2xl);
	}
	.summary {
		font-size: var(--fs-lg);
		max-width: var(--measure);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
	.cover {
		width: 100%;
		max-width: 56rem;
		border: var(--border);
		box-shadow: var(--shadow-lg);
	}
	.adjacent {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-6);
		margin-top: var(--sp-8);
	}
	.adj {
		display: grid;
		gap: var(--sp-2);
		padding: var(--sp-6);
		text-decoration: none;
	}
	.adj--next {
		text-align: right;
	}
	.adj-title {
		font-weight: var(--w-heavy);
		font-size: var(--fs-lg);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	@media (max-width: 40rem) {
		.adjacent {
			grid-template-columns: 1fr;
		}
		.adj--next {
			text-align: left;
		}
	}
</style>
