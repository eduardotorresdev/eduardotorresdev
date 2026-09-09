<script lang="ts">
	import { site } from '$lib/site';
	import { t, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let {
		locale,
		size = 'md',
		layout = 'row'
	}: { locale: Locale; size?: 'md' | 'lg'; layout?: 'row' | 'grid' | 'column' | 'bare' } = $props();
	const d = $derived(t(locale));
	const links = $derived([
		{ href: site.social.linkedin, label: d.social.linkedin, icon: 'linkedin' as const },
		{ href: site.social.github, label: d.social.github, icon: 'github' as const },
		{ href: site.social.instagram, label: d.social.instagram, icon: 'instagram' as const },
		{ href: `mailto:${site.email}`, label: d.social.email, icon: 'mail' as const }
	]);
</script>

<ul class="social social--{size} social--{layout}" role="list">
	{#each links as link (link.href)}
		<li>
			<a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="me noopener">
				<Icon name={link.icon} size={size === 'lg' ? 22 : 18} />
				<span>{link.label}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.social {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
	/* Grade 2x2: cada link ocupa a célula inteira. */
	.social--grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}
	/* Coluna única: pilha de links, todos da mesma largura. */
	.social--column {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--sp-3);
	}
	.social--grid a,
	.social--column a {
		display: flex;
		width: 100%;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		padding: 0.45em 0.8em;
		border: var(--border);
		background: var(--surface);
		box-shadow: var(--shadow-sm);
		font-weight: var(--w-regular);
		font-size: var(--fs-sm);
		text-decoration: none;
		transition:
			transform var(--dur) var(--ease-out),
			box-shadow var(--dur) var(--ease-out),
			background var(--dur) var(--ease-out),
			color var(--dur) var(--ease-out);
	}
	a:hover {
		background: var(--ink);
		color: var(--bg);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-md);
	}
	a:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}
	.social--lg a {
		font-size: var(--fs-md);
		padding: 0.6em 1em;
	}
	/* Só ícones, sem moldura: usado no header. */
	.social--bare {
		gap: var(--sp-1);
	}
	.social--bare a {
		/* Alvo de toque de 44px, mesmo que empurre o layout ao redor. */
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
		padding: var(--sp-2);
		border: none;
		background: none;
		box-shadow: none;
		color: var(--muted);
	}
	.social--bare a:hover {
		background: none;
		color: var(--ink);
		transform: none;
		box-shadow: none;
	}
	.social--bare a:active {
		transform: translate(1px, 1px);
		box-shadow: none;
	}
	.social--bare span {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
</style>
