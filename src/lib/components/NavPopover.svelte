<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<!--
	Prévia decorativa: aparece ao passar o mouse no link pai (só em dispositivos com hover).
	Fica fora da árvore de acessibilidade porque o link já leva ao conteúdo completo.
	Os links de dentro levam `tabindex="-1"`: continuam clicáveis no hover, mas
	saem da ordem de tabulação — senão o teclado entraria num painel que o leitor
	de tela não anuncia (axe `aria-hidden-focus`).
-->
<div class="popover" aria-hidden="true">
	<div class="arrow"></div>
	<div class="panel">
		{@render children()}
	</div>
</div>

<style>
	.popover {
		display: none;
	}
	@media (hover: hover) and (min-width: 52rem) {
		.popover {
			display: block;
			position: absolute;
			top: 100%;
			left: 50%;
			padding-top: 14px;
			width: max-content;
			min-width: 16rem;
			max-width: 22rem;
			z-index: 50;
			opacity: 0;
			pointer-events: none;
			transform: translate(-50%, 6px) scale(0.98);
			transform-origin: top center;
			transition:
				opacity var(--dur) var(--ease-out),
				transform 220ms var(--ease-out);
			transition-delay: 60ms;
		}
		:global(.item:hover) > .popover,
		:global(.item:focus-within) > .popover {
			opacity: 1;
			pointer-events: auto;
			transform: translate(-50%, 0) scale(1);
		}
		.arrow {
			position: absolute;
			top: 6px;
			left: 50%;
			width: 16px;
			height: 16px;
			background: var(--surface);
			border-left: var(--border);
			border-top: var(--border);
			transform: translateX(-50%) rotate(45deg);
			z-index: 1;
		}
		.panel {
			background: var(--surface);
			border: var(--border);
			box-shadow: var(--shadow-md);
			padding: var(--sp-4);
		}
	}
</style>
