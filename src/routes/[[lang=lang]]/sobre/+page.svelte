<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { href, localeFile, t } from '$lib/i18n';
	import { aboutContent } from '$lib/about';

	let { data } = $props();
	const locale = $derived(data.locale);
	const d = $derived(t(locale));
	const about = $derived(aboutContent[locale]);
</script>

<Seo
	{locale}
	title={d.about.title}
	description={d.about.lead}
	image="/og/{localeFile[locale]}/site/sobre.png"
	breadcrumbs={[{ name: d.about.title, path: href(locale, 'sobre') }]}
/>

<article class="container about">
	<header class="head">
		<p class="eyebrow">{d.about.title}</p>
		<h1>{d.about.lead}</h1>
	</header>

	<div class="grid">
		<div class="story prose">
			{#each about.story as paragraph (paragraph)}
				<p>{paragraph}</p>
			{/each}
		</div>
		<figure class="portrait">
			<img
				src="/img/eduardo-torres.webp"
				srcset="/img/eduardo-torres-560.webp 560w, /img/eduardo-torres.webp 920w"
				sizes="(min-width: 48rem) 384px, min(100vw, 224px)"
				alt={d.hero.photoAlt}
				width="920"
				height="1150"
				fetchpriority="high"
			/>
		</figure>
	</div>

	<section class="timeline">
		<h2>{d.about.experience}</h2>
		<ol role="list">
			{#each about.experience as job (job.company + job.period)}
				<li class="job">
					<div class="period">{job.period}</div>
					<div>
						<h3>{job.role}</h3>
						<p class="company">{job.company} · {job.place}</p>
						<ul>
							{#each job.highlights as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="timeline">
		<h2>{d.about.education}</h2>
		<ol role="list">
			{#each about.education as edu (edu.degree)}
				<li class="job">
					<div class="period">{edu.period}</div>
					<div>
						<h3>{edu.degree}</h3>
						<p class="company">{edu.school}</p>
						{#if edu.note}<p>{edu.note}</p>{/if}
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="stack">
		<h2>{d.about.stack}</h2>
		<dl>
			{#each about.stack as group (group.label)}
				<div class="group">
					<dt>{group.label}</dt>
					<dd>
						{#each group.items as item (item)}<span class="tag">{item}</span>{/each}
					</dd>
				</div>
			{/each}
		</dl>
	</section>

	<div class="social">
		<SocialLinks {locale} size="lg" />
	</div>
</article>

<style>
	.about {
		display: grid;
		gap: var(--sp-24);
		padding-block: var(--sp-8) var(--sp-16);
	}
	.head {
		display: grid;
		gap: var(--sp-4);
	}
	.head h1 {
		font-size: var(--fs-2xl);
		max-width: 20ch;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(14rem, 2fr);
		gap: var(--sp-12);
		align-items: start;
	}
	.story {
		font-size: var(--fs-lg);
	}
	.portrait {
		justify-self: end;
		width: min(100%, 24rem);
	}
	.portrait img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border: var(--border);
		box-shadow: var(--shadow-lg);
	}
	.timeline {
		display: grid;
		gap: var(--sp-8);
	}
	.timeline ol {
		display: grid;
	}
	.job {
		display: grid;
		grid-template-columns: 10rem 1fr;
		gap: var(--sp-6);
		padding-block: var(--sp-8);
		border-top: var(--border);
	}
	.job:last-child {
		border-bottom: var(--border);
	}
	.period {
		font-weight: var(--w-regular);
		color: var(--muted);
	}
	.job h3 {
		margin-bottom: var(--sp-2);
	}
	.company {
		font-weight: var(--w-regular);
		margin-bottom: var(--sp-4);
	}
	.job ul {
		padding-left: 1.2em;
		display: grid;
		gap: var(--sp-2);
		max-width: var(--measure);
	}
	.stack {
		display: grid;
		gap: var(--sp-8);
	}
	dl {
		display: grid;
		gap: var(--sp-6);
	}
	.group {
		display: grid;
		grid-template-columns: 10rem 1fr;
		gap: var(--sp-6);
		align-items: start;
	}
	dt {
		font-weight: var(--w-heavy);
	}
	dd {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
	@media (max-width: 48rem) {
		.grid,
		.job,
		.group {
			grid-template-columns: 1fr;
		}
		.portrait {
			order: -1;
			width: min(100%, 14rem);
			justify-self: start;
		}
	}
</style>
