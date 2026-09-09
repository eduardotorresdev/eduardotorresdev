<script lang="ts">
	import { page } from '$app/state';
	import { alternatePath, locales, localeLabel, t, type Locale } from '$lib/i18n';

	let { locale }: { locale: Locale } = $props();
	const d = $derived(t(locale));
</script>

<div class="toggle" role="group" aria-label="Idioma / Language">
	{#each locales as option (option)}
		{#if option === locale}
			<span class="opt is-active" aria-current="true">{localeLabel[option]}</span>
		{:else}
			<a
				class="opt"
				href={alternatePath(page, option)}
				hreflang={option}
				lang={option}
				title={d.nav.switchLocale}
				data-sveltekit-reload>{localeLabel[option]}</a
			>
		{/if}
	{/each}
</div>

<style>
	.toggle {
		display: inline-flex;
		border: var(--border);
		box-shadow: var(--shadow-sm);
		background: var(--surface);
	}
	.opt {
		padding: 0.3em 0.6em;
		font-size: var(--fs-xs);
		font-weight: var(--w-regular);
		letter-spacing: 0.08em;
		text-decoration: none;
		transition: background var(--dur) var(--ease-out);
	}
	.opt.is-active {
		background: var(--ink);
		color: var(--bg);
		font-weight: var(--w-heavy);
	}
	a.opt:hover {
		background: var(--line);
	}
</style>
