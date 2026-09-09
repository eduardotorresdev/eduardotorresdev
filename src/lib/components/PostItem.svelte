<script lang="ts">
	import { readingTime } from '$lib/content/reading-time';
	import type { Post } from '$lib/content/types';
	import { formatDate, href, t, type Locale } from '$lib/i18n';

	let { post, locale }: { post: Post; locale: Locale } = $props();
	const d = $derived(t(locale));
</script>

<li class="post">
	<div class="meta">
		<time datetime={post.meta.date}>{formatDate(locale, post.meta.date)}</time>
		<span>{d.blogMeta.readingTime(readingTime(post.words))}</span>
	</div>
	<h3><a href={href(locale, 'blog', post.slug)}>{post.meta.title}</a></h3>
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
	h3 a {
		text-decoration: none;
	}
	h3 a:hover {
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
