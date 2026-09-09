<script lang="ts">
	import { readingTime } from '$lib/content/reading-time';
	import type { Post } from '$lib/content/types';
	import { formatDate, href, t, type Locale } from '$lib/i18n';

	// Nos índices o item vem logo depois do <h1>, então precisa ser h2;
	// na home ele vive sob o <h2> da seção e continua h3.
	let { post, locale, level = 3 }: { post: Post; locale: Locale; level?: 2 | 3 } = $props();
	const d = $derived(t(locale));
</script>

<li class="post">
	<div class="meta">
		<time datetime={post.meta.date}>{formatDate(locale, post.meta.date)}</time>
		<span>{d.blogMeta.readingTime(readingTime(post.words))}</span>
	</div>
	<svelte:element this={`h${level}`} class="title">
		<a href={href(locale, 'blog', post.slug)}>{post.meta.title}</a>
	</svelte:element>
	<p class="summary">{post.meta.summary}</p>
	<ul class="tags" role="list">
		{#each post.meta.tags as tag (tag)}
			<li><a class="tag" href={href(locale, 'blog', 'tag', tag)}>{tag}</a></li>
		{/each}
	</ul>
</li>

<style>
	.post {
		display: grid;
		gap: var(--sp-3);
		padding-block: var(--sp-8);
		border-top: var(--border);
	}
	.post:last-child {
		border-bottom: var(--border);
	}
	.meta {
		display: flex;
		gap: var(--sp-4);
		font-size: var(--fs-sm);
		color: var(--muted);
		font-weight: var(--w-regular);
	}
	/* O nível do heading muda com o contexto; o tamanho, não. */
	.title {
		font-size: var(--fs-xl);
		letter-spacing: -0.02em;
	}
	.title a {
		text-decoration: none;
	}
	.title a:hover {
		text-decoration: underline;
		text-decoration-thickness: 4px;
	}
	.summary {
		max-width: var(--measure);
		font-size: var(--fs-md);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
</style>
