<script lang="ts">
	import PostItem from '$lib/components/PostItem.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { href, t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
</script>

<Seo {locale} title={d.nav.blog} description={d.sections.blog.lead} />

<div class="container blog">
	<header class="head">
		<p class="eyebrow">{d.nav.blog}</p>
		<h1>{d.sections.blog.lead}</h1>
		{#if data.tags.length}
			<ul class="tags" role="list" aria-label={d.blogMeta.tags}>
				{#each data.tags as { tag, count } (tag)}
					<li>
						<a class="tag" href={href(locale, 'blog', 'tag', tag)}>{tag} <span class="muted">{count}</span></a
						>
					</li>
				{/each}
			</ul>
		{/if}
	</header>

	{#if data.posts.length}
		<ul class="posts" role="list">
			{#each data.posts as post (post.slug)}
				<PostItem {post} {locale} />
			{/each}
		</ul>
	{:else}
		<p class="empty">{d.blogMeta.empty}</p>
	{/if}
</div>

<style>
	.blog {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-6);
	}
	h1 {
		font-size: var(--fs-2xl);
		max-width: 18ch;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
	.empty {
		padding: var(--sp-12);
		border: var(--border);
		box-shadow: var(--shadow-md);
		background: var(--surface);
		font-weight: var(--w-regular);
	}
</style>
