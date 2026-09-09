<script lang="ts">
	import type { Project } from '$lib/content/types';
	import { href, t, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let { entry, locale }: { entry: Project; locale: Locale } = $props();
	const d = $derived(t(locale));
	// Com corpo, vai pra interna. Sem corpo, direto pro link externo.
	const internal = $derived(entry.hasBody);
	const url = $derived(internal ? href(locale, 'projetos', entry.slug) : (entry.meta.link ?? '#'));
</script>

<li class="item">
	<a href={url} target={internal ? undefined : '_blank'} rel={internal ? undefined : 'noopener'}>
		<span class="kind">{d.projectMeta.type[entry.meta.type]} · {entry.meta.year}</span>
		<span class="title">{entry.meta.title}</span>
		<span class="summary">{entry.meta.summary}</span>
		<span class="go"><Icon name={internal ? 'arrow' : 'external'} size={22} /></span>
	</a>
</li>

<style>
	.item a {
		display: grid;
		grid-template-columns: 10rem 1fr auto;
		grid-template-areas: 'kind title go' 'kind summary go';
		gap: var(--sp-1) var(--sp-6);
		align-items: center;
		padding: var(--sp-6) 0;
		border-top: var(--border);
		text-decoration: none;
		transition: padding-left var(--dur) var(--ease-out);
	}
	.item:last-child a {
		border-bottom: var(--border);
	}
	.item a:hover {
		padding-left: var(--sp-3);
	}
	.kind {
		grid-area: kind;
		font-size: var(--fs-xs);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		font-weight: var(--w-regular);
	}
	.title {
		grid-area: title;
		font-weight: var(--w-heavy);
		font-size: var(--fs-xl);
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.summary {
		grid-area: summary;
		color: var(--muted);
	}
	.go {
		grid-area: go;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border: var(--border);
		background: var(--surface);
		box-shadow: var(--shadow-sm);
		transition: transform var(--dur) var(--ease-out);
	}
	.item a:hover .go {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-md);
	}
	@media (max-width: 40rem) {
		.item a {
			grid-template-columns: 1fr auto;
			grid-template-areas: 'kind go' 'title go' 'summary go';
		}
	}
</style>
