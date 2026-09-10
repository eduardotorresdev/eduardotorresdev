<script lang="ts">
	interface Props {
		/** Artigo cujo scroll é medido. */
		target?: HTMLElement;
		label: string;
	}

	let { target, label }: Props = $props();

	const radius = 20;
	const circumference = 2 * Math.PI * radius;

	let progress = $state(0);
	let visible = $state(false);
	const percent = $derived(Math.round(progress * 100));
	const complete = $derived(percent >= 100);

	// Progresso vai de 0 (topo do artigo na borda superior da viewport) a 1
	// (fim do artigo alcançado). O indicador só aparece depois do topo passar.
	function measure(el: HTMLElement) {
		const box = el.getBoundingClientRect();
		const passed = -box.top;
		const total = Math.max(box.height - window.innerHeight, 1);
		progress = Math.min(Math.max(passed / total, 0), 1);
		visible = passed > 0;
	}

	$effect(() => {
		const el = target;
		if (!el) return;

		let frame = 0;
		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				measure(el);
			});
		};

		measure(el);
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	});
</script>

<div
	class="progress"
	class:visible
	class:complete
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={percent}
	style:--progress={progress}
>
	<!-- Mostrador circular no desktop; barra fina no topo da viewport em telas menores. -->
	<div class="dial">
		<svg viewBox="0 0 48 48" aria-hidden="true">
			<circle
				class="bar"
				cx="24"
				cy="24"
				r={radius}
				stroke-dasharray={circumference}
				stroke-dashoffset={circumference * (1 - progress)}
			/>
		</svg>
		<span class="percent">{percent}</span>
	</div>
	<div class="track" aria-hidden="true"><div class="fill"></div></div>
</div>

<style>
	.progress {
		position: fixed;
		z-index: 5;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity var(--dur) var(--ease-out),
			transform var(--dur) var(--ease-out),
			visibility var(--dur);
	}
	.progress.visible {
		opacity: 1;
		visibility: visible;
		transform: none;
	}

	/* Barra horizontal: padrão, some a partir de 64rem. */
	.track {
		height: 4px;
		background: var(--surface);
		border-bottom: 1.5px solid var(--ink);
	}
	.fill {
		height: 100%;
		width: 100%;
		background: var(--ink);
		transform: scaleX(var(--progress));
		transform-origin: left center;
		transition: transform 120ms linear;
	}
	.dial {
		display: none;
	}

	@media (max-width: 63.999rem) {
		.progress {
			left: 0;
			right: 0;
			top: 0;
			transform: translateY(-100%);
		}
	}

	/* Mostrador circular só quando há folga ao lado do texto. */
	@media (min-width: 64rem) {
		.track {
			display: none;
		}
		.progress {
			left: var(--gutter);
			top: 10vh;
			transform: translateY(0.5rem);
			transition:
				opacity var(--dur) var(--ease-out),
				transform var(--dur) var(--ease-out),
				background-color var(--dur) var(--ease-out),
				color var(--dur) var(--ease-out),
				visibility var(--dur);
		}
		.dial {
			display: grid;
			place-items: center;
			position: relative;
			width: 3.5rem;
			height: 3.5rem;
			border: var(--border);
			border-radius: 50%;
			background: var(--surface);
			box-shadow: var(--shadow-sm);
			transition:
				background-color var(--dur) var(--ease-out),
				color var(--dur) var(--ease-out);
		}
		.progress.complete .dial {
			background: var(--ink);
			color: var(--bg);
		}
		svg {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			transform: rotate(-90deg);
			overflow: visible;
		}
		circle {
			fill: none;
			stroke-width: 3;
		}
		.bar {
			stroke: var(--ink);
			stroke-linecap: butt;
			/* suaviza o passo entre frames de scroll */
			transition: stroke-dashoffset 200ms linear;
		}
		.percent {
			font-size: var(--fs-xs);
			font-weight: var(--w-heavy);
			font-variant-numeric: tabular-nums;
			line-height: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bar,
		.fill {
			transition: none;
		}
		.progress {
			transition:
				opacity var(--dur) linear,
				background-color var(--dur) linear,
				color var(--dur) linear,
				visibility var(--dur);
			transform: none;
		}
	}
</style>
