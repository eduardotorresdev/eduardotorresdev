<!--
	Xícara chunky no espírito da Bricolage Grotesque: silhueta preta sólida,
	cantos arredondados, alça grossa e pires em barra, com hard shadow cinza.

	A entrada é encenada em quatro tempos: o pires preenche da esquerda pra
	direita, o corpo cresce da base pro topo por recorte, a alça se desenha
	pelo próprio path de baixo pra cima e, com a xícara montada, a fumaça
	entra em loop.
	Sem lib: só SVG e CSS.
-->
<script lang="ts">
	// `show` dispara o roteiro de entrada; a fumaça só começa depois dele.
	let { show = false }: { show?: boolean } = $props();

	// Fim da montagem da xícara (delay + duração do corpo/alça), em ms.
	const ASSEMBLED = 2100;

	// Cada fio roda como uma animação própria (Web Animations API) e, ao
	// terminar, recomeça com duração e pausa sorteadas. Trocar a duração de
	// uma animação CSS em andamento faz o browser recalcular o progresso e
	// pular; criar uma animação nova por volta evita isso. Um piscar
	// curto de opacidade nas pontas suaviza a entrada e a saída.
	const EASING = 'cubic-bezier(0.4, 0.35, 0.8, 0.4)';

	function play(wisp: SVGPathElement) {
		const animation = wisp.animate(
			[
				{ strokeDashoffset: 100, opacity: 0 },
				{ opacity: 1, offset: 0.05 },
				{ opacity: 1, offset: 0.96 },
				{ strokeDashoffset: -100, opacity: 0 }
			],
			{ duration: 1400 + Math.random() * 1200, easing: EASING, fill: 'forwards' }
		);
		animation.onfinish = () => {
			setTimeout(() => play(wisp), Math.random() * 350);
		};
		return animation;
	}

	function smoke(node: SVGGElement, active: boolean) {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const wisps = [...node.querySelectorAll<SVGPathElement>('.wisp')];
		let timer: ReturnType<typeof setTimeout> | undefined;
		let started = false;

		function start() {
			if (started || reduced) return;
			started = true;
			for (const wisp of wisps) wisp.style.animation = 'none';
			wisps.forEach((wisp, i) => {
				// começam desencontrados já na primeira volta
				play(wisp).currentTime = i * 400;
			});
		}

		function sync(on: boolean) {
			if (!on || started) return;
			// Espera a xícara terminar de se montar antes de fumegar.
			timer = setTimeout(start, ASSEMBLED);
		}

		sync(active);
		return {
			update: sync,
			destroy() {
				clearTimeout(timer);
				for (const wisp of wisps) for (const a of wisp.getAnimations()) a.cancel();
			}
		};
	}
</script>

{#snippet shape(color: string, offset: number)}
	<g {color} transform="translate({offset} {offset})">
		<!-- pires -->
		<rect class="saucer" x="14" y="160" width="138" height="12" rx="6" fill="currentColor" />
		<!-- corpo: sem escala, o recorte sobe da base até liberar a silhueta -->
		<path
			class="body"
			d="M28 78 H124 V122 C124 140 112 152 94 152 H58 C40 152 28 140 28 122 Z"
			fill="currentColor"
		/>
		<!--
			Alça: cresce sozinha pelo path, de baixo pra cima. As pontas entram
			8px pra dentro do corpo e a tampa é reta, então o traço nasce escondido
			na xícara em vez de virar uma bolinha solta na borda.
		-->
		<path
			class="handle"
			pathLength="100"
			d="M116 132 H136 C156 132 156 90 136 90 H116"
			stroke="currentColor"
			stroke-width="14"
			stroke-linecap="butt"
		/>
	</g>
{/snippet}

<svg class="cup" class:in={show} viewBox="0 0 180 180" fill="none" aria-hidden="true" focusable="false">
	<!-- fumaça: cada traço se desenha de baixo pra cima ao longo da onda e some pelo topo -->
	<g class="smoke" use:smoke={show} stroke="currentColor" stroke-width="8" stroke-linecap="butt">
		<path class="wisp wisp-1" pathLength="100" d="M50 62 C40 52 60 44 50 34 C40 24 60 16 50 6" />
		<path class="wisp wisp-2" pathLength="100" d="M76 62 C66 52 86 44 76 34 C66 24 86 16 76 6" />
		<path class="wisp wisp-3" pathLength="100" d="M102 62 C92 52 112 44 102 34 C92 24 112 16 102 6" />
	</g>

	<!-- hard shadow -->
	{@render shape('var(--shadow)', 8)}
	<!-- xícara -->
	{@render shape('var(--ink)', 0)}
</svg>

<style>
	.cup {
		display: block;
		width: 100%;
		height: auto;
		color: var(--ink);
		overflow: visible;
	}

	/* Antes da deixa nada aparece; cada parte entra no seu tempo. */
	.saucer {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: left center;
	}
	/* O corpo nasce recortado na base e o recorte sobe até liberar a silhueta. */
	.body {
		clip-path: inset(100% 0 0 0);
	}
	.handle {
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
	}

	.cup.in .saucer {
		animation: saucer-fill 720ms cubic-bezier(0.22, 0.8, 0.3, 1) forwards;
	}
	.cup.in .body {
		animation: body-rise 820ms cubic-bezier(0.22, 0.8, 0.3, 1) 600ms forwards;
	}
	.cup.in .handle {
		animation: handle-draw 660ms cubic-bezier(0.22, 0.8, 0.3, 1) 1420ms forwards;
	}

	@keyframes saucer-fill {
		from {
			opacity: 0;
			transform: scaleX(0);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}
	@keyframes body-rise {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}
	@keyframes handle-draw {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	/* A fumaça só aparece com a xícara já montada. */
	.smoke {
		opacity: 0;
	}
	.cup.in .smoke {
		opacity: 1;
		transition: opacity 320ms ease-out 2100ms;
	}

	/*
		pathLength="100" normaliza o comprimento. Com dasharray 100/100, levar o
		offset de 100 a -100 faz o traço entrar pela
		base, percorrer a onda e sair pelo topo. A animação CSS abaixo é só o
		fallback sem JS; com JS o script substitui por voltas com duração sorteada.
	*/
	.wisp {
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		animation: draw 2s cubic-bezier(0.4, 0.35, 0.8, 0.4) infinite;
	}
	.wisp-1 {
		animation-duration: 1.7s;
	}
	.wisp-2 {
		animation-duration: 2.3s;
	}
	.wisp-3 {
		animation-duration: 2s;
	}
	@keyframes draw {
		0% {
			stroke-dashoffset: 100;
		}
		88%,
		100% {
			stroke-dashoffset: -100;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wisp {
			animation: none;
			stroke-dasharray: none;
		}
		/* Sem movimento: a xícara já nasce montada. */
		.cup.in .saucer,
		.cup.in .body,
		.cup.in .handle {
			animation: none;
			opacity: 1;
			transform: none;
			clip-path: none;
			stroke-dashoffset: 0;
		}
		.saucer {
			transform: none;
		}
		.body {
			clip-path: none;
		}
		.cup.in .smoke {
			transition: none;
		}
	}
</style>
