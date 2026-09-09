<script lang="ts">
	import { page } from '$app/state';
	import { href, localeFromPath, t } from '$lib/i18n';

	const locale = $derived(localeFromPath(page.url.pathname));
	const d = $derived(t(locale));
</script>

<main class="container error" id="conteudo">
	<p class="eyebrow">{page.status}</p>
	<h1>{page.status === 404 ? d.notFound.title : (page.error?.message ?? 'Erro')}</h1>
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
