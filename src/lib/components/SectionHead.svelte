<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		eyebrow,
		title,
		lead,
		id,
		titleId,
		children
	}: {
		eyebrow?: string;
		title: string;
		lead?: string;
		id?: string;
		titleId?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="head" {id}>
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	<div class="row">
		<h2 id={titleId}>{title}</h2>
		{#if children}<div class="aside">{@render children()}</div>{/if}
	</div>
	{#if lead}<p class="lead">{lead}</p>{/if}
</div>

<style>
	.head {
		display: grid;
		gap: var(--sp-4);
		scroll-margin-top: var(--sp-8);
	}
	.row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--sp-6);
		flex-wrap: wrap;
	}
	.lead {
		max-width: var(--measure);
		font-size: var(--fs-lg);
	}
</style>
