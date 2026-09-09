<script lang="ts">
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { href, t } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
</script>

<Seo {locale} />

<section class="container hero">
	<div class="hero-text">
		<h1 class="hero-title">{d.hero.tagline}</h1>
		<p class="body">{d.hero.body}</p>
		<div class="hero-actions">
			<a class="button" href="#cases">{d.hero.cta}</a>
			<a class="button button--ghost" href={href(locale, 'sobre')}>{d.nav.about}</a>
		</div>
	</div>
	<figure class="portrait">
		<!--
			É o elemento de LCP da home: nada de lazy nem prioridade baixa.
			O desenho vive quase todo no canal alpha, então quem manda no peso do
			arquivo é o -alpha_q do cwebp, não o -q.

			Direção de arte: no mobile o traço cai pra 40% de opacidade, onde a
			hachura fina some — um arquivo menor ali é indistinguível e tira
			13 KB do caminho crítico do LCP.
		-->
		<picture>
			<source media="(max-width: 56rem)" srcset="/img/eduardo-torres-linhas-800.webp" />
			<img
				class="sketch"
				src="/img/eduardo-torres-linhas.webp"
				alt=""
				aria-hidden="true"
				width="1400"
				height="1232"
				fetchpriority="high"
				decoding="async"
			/>
		</picture>
		<img
			src="/img/eduardo-torres.webp"
			srcset="/img/eduardo-torres-560.webp 560w, /img/eduardo-torres.webp 920w"
			sizes="(min-width: 56rem) 486px, min(100vw, 320px)"
			alt={d.hero.photoAlt}
			width="920"
			height="1150"
			decoding="async"
		/>
	</figure>
</section>

<section class="container section" aria-labelledby="cases-title">
	<SectionHead
		id="cases"
		titleId="cases-title"
		title={d.sections.cases.title}
		lead={d.sections.cases.lead}
		eyebrow="01"
	/>
	<div class="cases">
		{#each data.cases as entry, index (entry.slug)}
			<CaseCard {entry} {locale} {index} />
		{/each}
	</div>
	<a class="all-cases" href={href(locale, 'cases')}>
		{d.sections.cases.all}
		<Icon name="arrow" size={18} />
	</a>
</section>

<section class="container section" aria-labelledby="projetos-title">
	<SectionHead
		id="projetos"
		titleId="projetos-title"
		title={d.sections.projects.title}
		lead={d.sections.projects.lead}
		eyebrow="02"
	/>
	<ul class="projects" role="list">
		{#each data.projects as entry (entry.slug)}
			<ProjectItem {entry} {locale} />
		{/each}
	</ul>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(18rem, 2fr);
		gap: var(--sp-12);
		align-items: center;
		/* o hero inteiro cabe em uma viewport: tipografia e espaços reagem à altura */
		min-height: calc(100svh - var(--header-h));
		/* cancela o padding-top do <main> só aqui, pra a conta fechar em 1 viewport */
		margin-top: calc(-1 * var(--sp-8));
		padding-block: clamp(1rem, 2.6svh, 2.5rem) clamp(1.25rem, 3.8svh, 4rem);
	}
	.hero-text {
		display: grid;
		gap: clamp(var(--sp-2), 1.8svh, var(--sp-6));
		justify-items: start;
	}
	.hero-title {
		font-size: min(var(--fs-2xl), 9svh);
		letter-spacing: -0.035em;
		line-height: 0.95;
		max-width: 18ch;
	}
	.body {
		max-width: var(--measure);
		font-size: min(var(--fs-lg), 3svh);
	}
	.hero-actions {
		display: flex;
		gap: var(--sp-4);
		flex-wrap: wrap;
	}
	.portrait {
		position: relative;
		justify-self: end;
		/* a figure é exatamente o quadro da foto (4:5): os % do traço resolvem contra ela.
		   Largura deriva da altura-alvo e é limitada pela coluna; nunca recorta a foto. */
		width: min(100%, calc(min(38rem, 100svh - 11rem) * 0.8));
	}
	/* Traço da mesma fachada da foto: encaixa nas linhas e vaza pra fora do quadro. */
	.sketch {
		position: absolute;
		z-index: 0;
		/* warp de perspectiva já embutido no arquivo (1755x1545 no referencial da foto 920x1150) */
		left: -58.26%;
		top: -22.7%;
		width: 190.76%;
		max-width: none;
		height: 134.35%;
		opacity: 0.6;
		pointer-events: none;
		/* dissolve as bordas do desenho pra não aparecer o corte reto do arquivo */
		mask-image:
			linear-gradient(to right, transparent, #000 18%, #000 82%, transparent),
			linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
		mask-composite: intersect;
		-webkit-mask-composite: source-in;
	}
	.portrait > img:not(.sketch) {
		position: relative;
		z-index: 1;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 5;
		border: var(--border);
		box-shadow: var(--shadow-lg);
	}
	.portrait::before {
		content: '';
		position: absolute;
		inset: 18px -18px -18px 18px;
		border: var(--border);
		z-index: -1;
	}
	.section {
		display: grid;
		gap: var(--sp-12);
		padding-block: var(--sp-16);
	}
	.cases {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--sp-8);
	}
	.all-cases {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		margin-top: calc(-1 * var(--sp-6));
		font-weight: var(--w-heavy);
		text-decoration: none;
	}
	.all-cases :global(svg) {
		transition: transform var(--dur) var(--ease-out);
	}
	.all-cases:hover :global(svg) {
		transform: translateX(4px);
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
	@media (max-width: 56rem) {
		.hero {
			grid-template-columns: 1fr;
			min-height: 0;
			margin-top: 0;
		}
		.portrait {
			justify-self: start;
			order: -1;
		}
		.portrait {
			width: min(100%, 20rem);
		}
		/* traço ampliado junto com a foto: pesa menos pra não competir com o texto */
		.sketch {
			opacity: 0.4;
		}
	}
</style>
