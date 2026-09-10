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
>
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

<style>
	.progress {
		position: fixed;
		left: var(--gutter);
		top: 10vh;
		z-index: 5;
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border: var(--border);
		border-radius: 50%;
		background: var(--surface);
		box-shadow: var(--shadow-sm);
		opacity: 0;
		visibility: hidden;
		transform: translateY(0.5rem);
		transition:
			opacity var(--dur) var(--ease-out),
			transform var(--dur) var(--ease-out),
			background-color var(--dur) var(--ease-out),
			color var(--dur) var(--ease-out),
			visibility var(--dur);
	}
	.progress.complete {
		background: var(--ink);
		color: var(--bg);
	}
	.progress.visible {
		opacity: 1;
		visibility: visible;
		transform: none;
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

	/* Não há folga ao lado do texto abaixo de 64rem. */
	@media (max-width: 64rem) {
		.progress {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bar {
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
