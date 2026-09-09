<script module lang="ts">
	// Componentes disponíveis em qualquer .md sem import explícito.
	export { default as Gallery } from './Gallery.svelte';
	export { default as Placeholder } from './Placeholder.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="prose">
	{@render children()}
</div>
