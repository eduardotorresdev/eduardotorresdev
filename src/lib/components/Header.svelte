<script lang="ts">
	import { page } from '$app/state';
	import type { Case, Post, Project } from '$lib/content/types';
	import { formatDate, homeAnchor, href, t, type Locale } from '$lib/i18n';
	import { site } from '$lib/site';
	import Icon from './Icon.svelte';
	import LangToggle from './LangToggle.svelte';
	import NavPopover from './NavPopover.svelte';
	import SocialLinks from './SocialLinks.svelte';

	interface Preview {
		cases: Case[];
		projects: Project[];
		posts: Post[];
	}

	let { locale, preview }: { locale: Locale; preview: Preview } = $props();

	const d = $derived(t(locale));
	let open = $state(false);

	const items = $derived([
		{ key: 'cases', label: d.nav.cases, href: href(locale, 'cases') },
		{ key: 'projects', label: d.nav.projects, href: homeAnchor(locale, 'projetos') },
		{ key: 'blog', label: d.nav.blog, href: href(locale, 'blog') },
		{ key: 'about', label: d.nav.about, href: href(locale, 'sobre') },
		{ key: 'contact', label: d.nav.contact, href: '#contato' }
	] as const);

	function isCurrent(itemHref: string): boolean {
		const path = page.url.pathname;
		return !itemHref.includes('#') && path.startsWith(itemHref);
	}

	// Fecha o menu mobile ao navegar.
	$effect(() => {
		void page.url;
		open = false;
	});
</script>

<header class="header">
	<a class="skip" href="#conteudo">{d.nav.skip}</a>
	<div class="container bar">
		<div class="identity">
			<div class="identity-top">
				<a class="brand" href={href(locale)}>{site.domain}</a>
				<SocialLinks {locale} layout="bare" />
			</div>
			<p class="place">
				<Icon name="pin" size={12} filled />
				<span>{d.nav.location}</span>
				<span class="rule" aria-hidden="true"></span>
				<span class="utc">UTC−3</span>
			</p>
		</div>

		<button
			class="menu-btn"
			type="button"
			aria-expanded={open}
			aria-controls="nav-principal"
			onclick={() => (open = !open)}
		>
			{open ? d.nav.close : d.nav.menu}
		</button>

		<nav aria-label={d.nav.mainNav} id="nav-principal" class="nav" class:is-open={open}>
			<ul role="list">
				{#each items as item (item.key)}
					<li class="item">
						<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a>
						<NavPopover>
							{#if item.key === 'cases'}
								<p class="pop-lead">{d.popover.cases}</p>
								<ul class="pop-grid" role="list">
									{#each preview.cases.slice(0, 3) as c (c.slug)}
										<li>
											<a href={href(locale, 'cases', c.slug)} class="pop-case" tabindex="-1">
												{#if c.meta.cover}
													<img src={c.meta.cover} alt="" loading="lazy" width="160" height="100" />
												{:else}
													<span class="pop-cover-fallback" aria-hidden="true"
														>{c.meta.client.slice(0, 2)}</span
													>
												{/if}
												<span>{c.meta.title}</span>
											</a>
										</li>
									{/each}
								</ul>
							{:else if item.key === 'projects'}
								<p class="pop-lead">{d.popover.projects}</p>
								<ul class="pop-list" role="list">
									{#each preview.projects.slice(0, 3) as p (p.slug)}
										<li>
											<span class="pop-kind">{d.projectMeta.type[p.meta.type]}</span>
											<span>{p.meta.title}</span>
										</li>
									{/each}
								</ul>
							{:else if item.key === 'blog'}
								<p class="pop-lead">{d.popover.blog}</p>
								<ul class="pop-list" role="list">
									{#each preview.posts.slice(0, 3) as post (post.slug)}
										<li>
											<span class="pop-kind">{formatDate(locale, post.meta.date)}</span>
											<a href={href(locale, 'blog', post.slug)} tabindex="-1">{post.meta.title}</a>
										</li>
									{:else}
										<li class="muted">{d.blogMeta.empty}</li>
									{/each}
								</ul>
							{:else if item.key === 'about'}
								<div class="pop-about">
									<img src="/img/eduardo-torres-avatar.webp" alt="" width="56" height="56" loading="lazy" />
									<p>{d.popover.about}</p>
								</div>
							{:else}
								<p class="pop-lead">{d.popover.contact}</p>
								<p class="pop-email">{site.email}</p>
							{/if}
						</NavPopover>
					</li>
				{/each}
			</ul>
			<LangToggle {locale} />
		</nav>
	</div>
</header>

<style>
	.header {
		padding-block: var(--sp-6);
	}
	.skip {
		position: absolute;
		left: var(--sp-4);
		top: -100%;
		padding: var(--sp-2) var(--sp-4);
		background: var(--ink);
		color: var(--bg);
		z-index: 100;
	}
	.skip:focus {
		top: var(--sp-4);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-6);
		flex-wrap: wrap;
	}
	.identity {
		display: grid;
		gap: 2px;
	}
	.identity-top {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}
	.brand {
		font-weight: var(--w-heavy);
		font-size: var(--fs-lg);
		letter-spacing: -0.03em;
		text-decoration: none;
		line-height: 1.05;
	}
	.place {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: var(--fs-xs);
		font-weight: var(--w-light);
		letter-spacing: 0.04em;
		color: var(--muted);
		line-height: 1;
	}
	.place :global(svg) {
		flex: none;
		margin-block-start: -1px;
	}
	.rule {
		width: 1.5px;
		height: 0.8em;
		background: currentColor;
	}
	.utc {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0;
	}
	.menu-btn {
		display: none;
		padding: 0.4em 0.9em;
		border: var(--border);
		background: var(--surface);
		box-shadow: var(--shadow-sm);
		font-weight: var(--w-heavy);
	}
	.nav {
		display: flex;
		align-items: center;
		gap: var(--sp-8);
	}
	.nav > ul {
		display: flex;
		gap: var(--sp-6);
	}
	.item {
		position: relative;
	}
	.item > a {
		display: inline-block;
		padding-block: var(--sp-2);
		font-weight: var(--w-regular);
		text-decoration: none;
		border-bottom: 2px solid transparent;
		transition: border-color var(--dur) var(--ease-out);
	}
	.item > a:hover,
	.item > a[aria-current='page'] {
		border-color: var(--ink);
	}

	/* Conteúdo dos popovers */
	.pop-lead {
		font-weight: var(--w-regular);
		font-size: var(--fs-sm);
		margin-bottom: var(--sp-3);
	}
	.pop-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--sp-3);
	}
	.pop-case {
		display: grid;
		gap: var(--sp-2);
		font-size: var(--fs-xs);
		font-weight: var(--w-regular);
		text-decoration: none;
		line-height: 1.2;
	}
	.pop-case img,
	.pop-cover-fallback {
		aspect-ratio: 16 / 10;
		width: 100%;
		height: auto;
		object-fit: cover;
		border: 1.5px solid var(--ink);
		filter: grayscale(1) contrast(1.1);
	}
	.pop-cover-fallback {
		display: grid;
		place-items: center;
		background: var(--bg);
		font-weight: var(--w-heavy);
		font-size: var(--fs-lg);
	}
	.pop-list {
		display: grid;
		gap: var(--sp-2);
		font-size: var(--fs-sm);
	}
	.pop-list li {
		display: grid;
		gap: 2px;
	}
	.pop-list a {
		font-weight: var(--w-regular);
		text-decoration: none;
	}
	.pop-list a:hover {
		text-decoration: underline;
	}
	.pop-kind {
		font-size: var(--fs-xs);
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.pop-about {
		display: flex;
		gap: var(--sp-3);
		align-items: center;
		font-size: var(--fs-sm);
	}
	.pop-about img {
		width: 56px;
		height: 56px;
		object-fit: cover;
		border: 1.5px solid var(--ink);
	}
	.pop-email {
		font-weight: var(--w-heavy);
		font-size: var(--fs-md);
		letter-spacing: -0.01em;
	}

	@media (max-width: 52rem) {
		.menu-btn {
			display: inline-block;
			align-self: center;
		}
		.nav {
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--sp-4);
			padding-top: var(--sp-4);
			border-top: var(--border);
			margin-top: var(--sp-4);
		}
		.nav.is-open {
			display: flex;
		}
		.nav > ul {
			flex-direction: column;
			gap: var(--sp-2);
		}
		/* No mobile o bloco vira parte da grade da identidade
		   pra o social cair abaixo da linha do pin. */
		.identity-top {
			display: contents;
		}
		.identity :global(.social--bare) {
			order: 3;
			margin-top: calc(var(--sp-1) * -1);
			margin-inline-start: calc(var(--sp-1) * -1);
		}
		.item > a {
			font-size: var(--fs-xl);
			font-weight: var(--w-heavy);
			letter-spacing: -0.02em;
		}
	}
</style>
