<script lang="ts">
	import type { Tldr } from '$lib/content/types';

	// `label` é o rótulo visível (TL;DR); `description` nomeia a região pra leitor de tela.
	let { items, label, description }: { items: Tldr; label: string; description: string } = $props();

	const list = $derived((Array.isArray(items) ? items : [items]).filter((item) => item.trim() !== ''));
</script>

{#if list.length > 0}
	<aside class="tldr block" aria-label={description}>
		<p class="eyebrow" aria-hidden="true">{label}</p>
		<ul role="list">
			{#each list as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	</aside>
{/if}

<style>
	.tldr {
		display: grid;
		gap: var(--sp-3);
		padding: var(--sp-6);
	}
	ul {
		display: grid;
		gap: var(--sp-2);
	}
	li {
		position: relative;
		padding-left: var(--sp-6);
		font-weight: var(--w-regular);
		line-height: 1.5;
	}
	li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 0.6em;
		height: 0.6em;
		background: var(--ink);
	}
</style>
