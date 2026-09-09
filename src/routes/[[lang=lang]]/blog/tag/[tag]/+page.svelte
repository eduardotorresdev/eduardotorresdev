<script lang="ts">
	import PostItem from '$lib/components/PostItem.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { href, t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
</script>

<Seo {locale} title={d.blogMeta.taggedWith(data.tag)} />

<div class="container wrap">
	<header class="head">
		<a class="back" href={href(locale, 'blog')}>← {d.blogMeta.allPosts}</a>
		<h1>{d.blogMeta.taggedWith(data.tag)}</h1>
	</header>
	<ul role="list">
		{#each data.posts as post (post.slug)}
			<PostItem {post} {locale} level={2} />
		{/each}
	</ul>
</div>

<style>
	.wrap {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-4);
	}
	h1 {
		font-size: var(--fs-2xl);
	}
	.back {
		font-weight: var(--w-regular);
		text-decoration: none;
	}
</style>
