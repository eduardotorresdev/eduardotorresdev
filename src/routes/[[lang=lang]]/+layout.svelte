<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	let { data, children } = $props();
</script>

<div class="page">
	<Header locale={data.locale} preview={data.preview} />
	<main id="conteudo" class="main">
		{@render children()}
	</main>
	<Footer locale={data.locale} />
</div>

<style>
	.page {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100dvh;
	}
	.main {
		padding-block: var(--sp-8) 0;
	}
</style>
