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
	// Borda inferior e centro do botão de menu, relativos ao header,
	// pra o painel mobile nascer logo abaixo dele com a seta apontando pro botão.
	let menuBtn: HTMLButtonElement | undefined = $state();
	let anchorTop = $state(0);
	let anchorRight = $state(0);

	function measure() {
		if (!menuBtn) return;
		const header = menuBtn.closest('header') as HTMLElement;
		const b = menuBtn.getBoundingClientRect();
		const h = header.getBoundingClientRect();
		anchorTop = b.bottom - h.top;
		anchorRight = h.right - (b.left + b.width / 2);
	}

	$effect(() => {
		if (!open) return;
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	});

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

<header
	class="header"
	class:is-open={open}
	style="--anchor-top: {anchorTop}px; --anchor-right: {anchorRight}px"
>
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

		<div class="actions">
			<LangToggle {locale} />
			<button
				class="menu-btn"
				type="button"
				bind:this={menuBtn}
				aria-expanded={open}
				aria-controls="nav-principal"
				aria-label={open ? d.nav.close : d.nav.menu}
				onclick={() => (open = !open)}
			>
				<!-- Os dois rótulos ocupam a mesma célula: a largura não pula ao trocar. -->
				<span class="menu-label" class:is-on={!open} aria-hidden="true">{d.nav.menu}</span>
				<span class="menu-label" class:is-on={open} aria-hidden="true">{d.nav.close}</span>
			</button>
		</div>

		<span class="arrow" class:is-open={open} aria-hidden="true"></span>
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
		justify-content: flex-end;
		gap: var(--sp-6);
		flex-wrap: wrap;
	}
	.identity {
		display: grid;
		gap: 2px;
		/* Empurra nav e ações pra direita, juntas. */
		margin-inline-end: auto;
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
	.actions {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
		order: 3;
	}
	.menu-btn {
		display: none;
		position: relative;
		isolation: isolate;
		padding: 0.4em 0.9em;
		border: var(--border);
		background: var(--surface);
		box-shadow: var(--shadow-sm);
		font-weight: var(--w-heavy);
		overflow: hidden;
	}
	/* Fundo escuro que cresce do centro quando o menu abre. */
	.menu-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--ink);
		transform: scale(0);
		transform-origin: center;
		transition: transform 260ms var(--ease-out);
		z-index: -1;
	}
	.menu-btn[aria-expanded='true']::before {
		transform: scale(1);
	}
	.menu-label {
		grid-area: 1 / 1;
		opacity: 0;
		transform: scale(0.8);
		transition:
			opacity var(--dur) var(--ease-out),
			transform var(--dur) var(--ease-out),
			color var(--dur) var(--ease-out);
	}
	.menu-label.is-on {
		opacity: 1;
		transform: none;
	}
	.menu-btn[aria-expanded='true'] .menu-label {
		color: var(--bg);
	}
	.arrow {
		display: none;
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
		/* O menu abre por cima do conteúdo, ancorado no header: nada da página se move. */
		.header {
			position: relative;
		}
		/* Ações na mesma linha do logo, sem quebrar; menores pra caber. */
		.bar {
			flex-wrap: nowrap;
			align-items: flex-start;
			gap: var(--sp-3);
		}
		.actions {
			flex: none;
			flex-direction: column;
			align-items: flex-end;
			gap: var(--sp-2);
			margin-block-start: -2px;
		}
		.actions :global(.toggle) {
			order: 2;
			transition: opacity var(--dur) var(--ease-out);
		}
		/* Com o painel aberto o switch ficaria espremido sob a borda: some. */
		.header.is-open .actions :global(.toggle) {
			opacity: 0;
			pointer-events: none;
		}
		.actions :global(.opt) {
			padding: 0.25em 0.45em;
			font-size: 0.65rem;
		}
		.menu-btn {
			display: inline-grid;
			place-items: center;
			position: relative;
			z-index: 61;
			padding: 0.3em 0.6em;
			font-size: var(--fs-xs);
		}
		.nav {
			position: absolute;
			top: calc(var(--anchor-top) + 12px);
			left: 0;
			right: 0;
			z-index: 60;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--sp-4);
			padding: var(--sp-4) var(--gutter) var(--sp-8);
			background: var(--surface);
			border-bottom: var(--border);
			box-shadow: var(--shadow-md);
			border-top: var(--border);
			/* Fundo revela de cima pra baixo recortando a altura, depois que a seta abriu. */
			clip-path: inset(0 0 100% 0);
			visibility: hidden;
			transition:
				clip-path 360ms var(--ease-out),
				visibility 0s linear 360ms;
		}
		/* Seta que liga o painel ao botão: cresce a partir da ponta, abrindo pros lados. */
		.arrow {
			display: block;
			position: absolute;
			/* Com a origem no canto, o canto superior-esquerdo da caixa é a ponta:
			   fica no centro do botão, e a metade de baixo cobre a borda do painel. */
			top: calc(var(--anchor-top) + 2px);
			right: calc(var(--anchor-right) - 16px);
			width: 16px;
			height: 16px;
			background: var(--surface);
			border-left: var(--border);
			border-top: var(--border);
			z-index: 62;
			/* O canto superior-esquerdo local vira a ponta depois do rotate. */
			transform-origin: 0 0;
			transform: rotate(45deg) scale(0);
			transition: transform 200ms var(--ease-out) 240ms;
		}
		.arrow.is-open {
			transform: rotate(45deg) scale(1);
			transition: transform 200ms var(--ease-out);
		}
		.nav.is-open {
			clip-path: inset(0 0 0 0);
			visibility: visible;
			transition:
				clip-path 360ms var(--ease-out) 140ms,
				visibility 0s;
		}
		.nav > ul {
			flex-direction: column;
			gap: var(--sp-2);
		}
		/* Cada item entra com scale + fade, escalonado conforme o fundo desce. */
		.item {
			opacity: 0;
			transform: scale(0);
			transform-origin: center top;
			transition:
				opacity 200ms var(--ease-out),
				transform 260ms var(--ease-out);
			transition-delay: 0s;
		}
		.nav.is-open .item {
			opacity: 1;
			transform: none;
			transition-delay: calc(200ms + var(--i, 0) * 45ms);
		}
		.item:nth-child(1) {
			--i: 0;
		}
		.item:nth-child(2) {
			--i: 1;
		}
		.item:nth-child(3) {
			--i: 2;
		}
		.item:nth-child(4) {
			--i: 3;
		}
		.item:nth-child(5) {
			--i: 4;
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
			font-size: var(--fs-lg);
			font-weight: var(--w-heavy);
			letter-spacing: -0.02em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav,
		.nav.is-open,
		.arrow,
		.menu-btn::before,
		.menu-label,
		.item {
			transition: none;
			transition-delay: 0s;
		}
	}
</style>
