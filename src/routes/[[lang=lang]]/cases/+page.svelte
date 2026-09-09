<script lang="ts">
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
</script>

<Seo {locale} title={d.sections.cases.title} description={d.sections.cases.lead} />

<div class="container cases-page">
	<header class="head">
		<p class="eyebrow">{d.nav.cases}</p>
		<h1>{d.sections.cases.lead}</h1>
	</header>

	<div class="cases">
		{#each data.cases as entry, index (entry.slug)}
			<CaseCard {entry} {locale} {index} />
		{/each}
	</div>
</div>

<style>
	.cases-page {
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
	.cases {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--sp-8);
	}
	@media (max-width: 68rem) {
		.cases {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 44rem) {
		.cases {
			grid-template-columns: 1fr;
		}
	}
</style>
