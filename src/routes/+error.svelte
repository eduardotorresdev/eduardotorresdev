<script lang="ts">
	import { page } from '$app/state';
	import { href, localeFromPath, t } from '$lib/i18n';
	import { site } from '$lib/site';

	const locale = $derived(localeFromPath(page.url.pathname));
	const d = $derived(t(locale));
	const title = $derived(page.status === 404 ? d.notFound.title : (page.error?.message ?? 'Erro'));
</script>

<svelte:head>
	<title>{title} · {site.name}</title>
	<meta name="description" content={d.notFound.body} />
	<!-- Erro não é conteúdo: fora do índice e sem canonical apontando pra si. -->
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<main class="container error" id="conteudo">
	<p class="eyebrow">{page.status}</p>
	<h1>{title}</h1>
	<p>{d.notFound.body}</p>
	<a class="button" href={href(locale)}>{d.notFound.back}</a>
</main>

<style>
	.error {
		display: grid;
		gap: var(--sp-6);
		justify-items: start;
		padding-block: var(--sp-24);
	}
</style>
