<script lang="ts">
	import { t, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';
	import CoffeeCup from './CoffeeCup.svelte';
	import ContactForm from './ContactForm.svelte';
	import SocialLinks from './SocialLinks.svelte';

	let { locale }: { locale: Locale } = $props();
	const d = $derived(t(locale));

	const TYPE_STEP = 95; // ms base por caractere

	// Ritmo humano: jitter em cada tecla, respiro no espaço e uma hesitação
	// mais longa e esparsa no meio da palavra.
	function nextDelay(char: string) {
		const jitter = TYPE_STEP * (0.6 + Math.random() * 0.8);
		if (char === ' ') return jitter + 220;
		// Pausa maior antes da pontuação final, como quem pensa no tom da frase.
		if (char === '?' || char === '!' || char === '.') return jitter + 400;
		if (Math.random() < 0.14) return jitter + 260 + Math.random() * 220;
		return jitter;
	}

	// Quantidade de caracteres do título já digitados; -1 = ainda não começou.
	let typed = $state(-1);
	const title = $derived(d.sections.contact.title);
	const done = $derived(typed >= title.length);

	// Dispara a digitação quando 20% do footer entra na viewport.
	function typewriter(node: HTMLElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			typed = Infinity;
			return;
		}
		let timer: ReturnType<typeof setTimeout> | undefined;
		function step() {
			typed += 1;
			if (typed >= title.length) return;
			timer = setTimeout(step, nextDelay(title[typed]));
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				typed = 0;
				timer = setTimeout(step, nextDelay(title[0]));
			},
			{ threshold: 0.2 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
				clearTimeout(timer);
			}
		};
	}

	// Clarão circular que segue o ponteiro, cobrindo só o fundo do footer.
	const SPOT_EASE = 0.09; // fração da distância percorrida por quadro

	let spotX = $state(0);
	let spotY = $state(0);
	let spotOn = $state(false);
	// Onde o ponteiro está de fato; o clarão persegue esses valores com atraso.
	let targetX = 0;
	let targetY = 0;
	let frame: number | undefined;

	function chase() {
		spotX += (targetX - spotX) * SPOT_EASE;
		spotY += (targetY - spotY) * SPOT_EASE;
		frame = requestAnimationFrame(chase);
	}

	function trackSpot(event: PointerEvent) {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		targetX = event.clientX - box.left;
		targetY = event.clientY - box.top;
		// Sem animação o clarão gruda no ponteiro, sem perseguição.
		if (frame === undefined && spotOn) {
			spotX = targetX;
			spotY = targetY;
			return;
		}
		if (spotOn) return;
		// Ao entrar não há o que perseguir: nasce já embaixo do ponteiro.
		spotX = targetX;
		spotY = targetY;
		spotOn = true;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			frame = requestAnimationFrame(chase);
		}
	}

	function leaveSpot() {
		spotOn = false;
		stopChase();
	}

	function stopChase() {
		if (frame !== undefined) cancelAnimationFrame(frame);
		frame = undefined;
	}

	$effect(() => stopChase);
</script>

<footer class="footer" id="contato" use:typewriter onpointermove={trackSpot} onpointerleave={leaveSpot}>
	<!-- Desenho a traço de São Luís, bem apagado, atrás de todo o footer. -->
	<img
		class="bg"
		src="/img/sao-luis-linhas.webp"
		alt=""
		aria-hidden="true"
		width="1280"
		height="853"
		loading="lazy"
		decoding="async"
	/>

	<!-- Clarão que acompanha o ponteiro; fica entre o desenho de fundo e o conteúdo. -->
	<div
		class="spot"
		class:on={spotOn}
		aria-hidden="true"
		style="--spot-x: {spotX}px; --spot-y: {spotY}px"
	></div>

	<div class="container inner">
		<div class="head">
			<div class="title-row">
				<h2 class="title" class:typing={typed >= 0 && !done}>
					<!-- Cópia invisível segura a largura final, então nada dança enquanto digita. -->
					<span class="ghost" aria-hidden="true">{title}</span>
					<span class="typed" aria-hidden="true">{typed < 0 ? '' : title.slice(0, typed)}</span>
					<span class="visually-hidden">{title}</span>
				</h2>
				<div class="cup"><CoffeeCup show={done} /></div>
			</div>
		</div>

		<div class="grid">
			<div class="form-col">
				<ContactForm {locale} />
			</div>
			<aside class="side">
				<SocialLinks {locale} size="lg" layout="column" />
			</aside>
		</div>

		<!-- Só o crédito do desenho de fundo, no canto. -->
		<div class="bottom">
			<p class="place">
				<Icon name="pin" size={18} filled />
				{d.footer.based}
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		margin-top: var(--sp-24);
		/*
			Topo curto: o conteúdo fica alto e a sobra vira espaço no pé — parte
			antes do crédito, parte depois dele. O que o footer ganha de padding
			embaixo ele devolve na margem de cima, então a página não estica.
		*/
		padding-block: var(--sp-8) var(--sp-16);
		overflow: hidden;
		isolation: isolate;
		/* O multiply do vídeo precisa de um fundo opaco dentro deste contexto. */
		background: var(--bg);
	}
	.bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center bottom;
		/*
			O brilho apaga o cinza do papel e o multiply faz o branco sumir no fundo,
			sobrando só o traço — mesma discrição de antes, sem o véu cinza.
		*/
		filter: grayscale(1) brightness(1.5) contrast(1.3);
		mix-blend-mode: multiply;
		opacity: 0.2;
		pointer-events: none;
		z-index: -1;
		mask-image: linear-gradient(to bottom, transparent, black 45%);
	}
	.spot {
		position: absolute;
		top: 0;
		left: 0;
		width: 31vw;
		height: 31vw;
		/* Borda difusa: cheio no miolo, dissolvendo até sumir na borda do círculo. */
		background: radial-gradient(
			circle closest-side,
			color-mix(in srgb, var(--bg) 80%, transparent) 0%,
			color-mix(in srgb, var(--bg) 80%, transparent) 30%,
			color-mix(in srgb, var(--bg) 55%, transparent) 55%,
			color-mix(in srgb, var(--bg) 20%, transparent) 78%,
			transparent 100%
		);
		filter: blur(8px);
		translate: calc(var(--spot-x) - 15.5vw) calc(var(--spot-y) - 15.5vw);
		pointer-events: none;
		opacity: 0;
		scale: 0.75;
		transition:
			opacity 450ms ease,
			scale 450ms ease;
		z-index: 0;
	}
	.spot.on {
		opacity: 1;
		scale: 1;
	}
	/* Sem ponteiro fino não há o que seguir. */
	@media (hover: none) {
		.spot {
			display: none;
		}
	}
	.inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: var(--sp-16);
	}
	.head {
		margin-bottom: var(--sp-12);
		display: grid;
		gap: var(--sp-4);
		justify-items: center;
		text-align: center;
	}
	.title-row {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: var(--sp-6);
		flex-wrap: wrap;
	}
	.title {
		display: grid;
		/* Nunca quebra linha: no mobile o tamanho segue a largura da tela. */
		font-size: min(var(--fs-3xl), 10vw);
		line-height: 0.88;
		white-space: nowrap;
	}
	/* Fantasma e texto digitado ocupam a mesma célula do grid. */
	.ghost,
	.typed {
		grid-area: 1 / 1;
		white-space: pre;
	}
	.ghost {
		visibility: hidden;
	}
	.typed::after {
		content: '';
		display: inline-block;
		width: 0.06em;
		height: 0.8em;
		margin-left: 0.06em;
		vertical-align: -0.02em;
		background: var(--ink);
		opacity: 0;
		border-radius: 1px;
	}
	.title.typing .typed::after {
		animation: caret 1.1s step-end infinite;
	}
	@keyframes caret {
		0%,
		50% {
			opacity: 1;
		}
		50.01%,
		100% {
			opacity: 0;
		}
	}
	/*
		Caixa de tamanho fixo: a xícara é desenhada dentro dela em absoluto, então
		nada do que a animação faz (escala, traço, fumaça) mexe no layout da linha.
	*/
	.cup {
		position: relative;
		width: clamp(4rem, 3rem + 5vw, 8rem);
		aspect-ratio: 1;
		flex: none;
		margin-bottom: 0.1em;
	}
	.cup :global(svg) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	@media (prefers-reduced-motion: reduce) {
		.title.typing .typed::after {
			animation: none;
		}
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(13rem, max-content);
		gap: var(--sp-16);
		align-items: start;
		/* Formulário e redes não passam disso; em telas largas fica centralizado. */
		width: 100%;
		max-width: 64rem;
		margin-inline: auto;
	}
	@media (max-width: 56rem) {
		.grid {
			grid-template-columns: 1fr;
		}
		/* No mobile o título e a xícara ficam mais juntos e o respiro até o form encurta. */
		.inner {
			gap: var(--sp-8);
		}
		.head {
			margin-bottom: var(--sp-8);
		}
		/* Título e xícara dividem a mesma linha; o título pode quebrar em duas,
		   então o que precisa caber ao lado da xícara é a palavra mais longa. */
		.head {
			justify-items: stretch;
		}
		/* A linha precisa ter a largura toda, senão ela cresce com o texto e nada quebra. */
		.title-row {
			width: 100%;
			flex-wrap: nowrap;
			align-items: flex-end;
			gap: var(--sp-3);
		}
		.title {
			white-space: normal;
			text-align: left;
			font-size: calc((100vw - 2 * var(--gutter) - 3.5rem - var(--sp-3)) / 5.3);
		}
		.ghost,
		.typed {
			white-space: pre-wrap;
		}
		.cup {
			width: 3.5rem;
			margin-bottom: 0;
		}
	}
	.bottom {
		display: flex;
		justify-content: flex-end;
		/* Sobra do topo somada ao respiro original. */
		padding-top: calc(var(--sp-6) + var(--sp-4));
		min-height: calc(var(--sp-6) + 1.5em);
	}
	/* Crédito do desenho que corre atrás do footer. */
	.place {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		color: var(--ink);
		font-size: var(--fs-sm);
	}
	.place :global(svg) {
		flex: none;
	}
</style>
