<script lang="ts">
	import { t, type Locale } from '$lib/i18n';
	import Icon from './Icon.svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { fade } from 'svelte/transition';

	let { locale }: { locale: Locale } = $props();
	const d = $derived(t(locale));

	type Status = 'idle' | 'sending' | 'sent' | 'error';
	let status = $state<Status>('idle');
	const MESSAGE_MAX = 150;
	// O campo continua indo como `subject` no payload: é o assunto do e-mail.
	let message = $state('');
	// Passou do limite: dá pra continuar escrevendo, mas não pra enviar.
	const overLimit = $derived(message.length >= MESSAGE_MAX);
	// O contador só aparece perto do fim, a 70% do limite.
	const showCounter = $derived(message.length >= MESSAGE_MAX * 0.7);

	/*
	 * O script do Turnstile pesa ~120 KB e o formulário vive no rodapé de toda
	 * página. Só buscamos quando o widget chega perto da viewport, para não
	 * cobrar esse terceiro de quem nunca desce até o contato.
	 */
	function turnstile(node: HTMLElement) {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				if (document.querySelector('script[data-turnstile]')) return;
				const preconnect = document.createElement('link');
				preconnect.rel = 'preconnect';
				preconnect.href = 'https://challenges.cloudflare.com';
				preconnect.crossOrigin = '';
				document.head.append(preconnect);
				const script = document.createElement('script');
				script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
				script.async = true;
				script.defer = true;
				script.dataset.turnstile = '';
				document.head.append(script);
			},
			{ rootMargin: '400px' }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const body = Object.fromEntries(new FormData(form).entries());
		status = 'sending';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...body, locale })
			});
			if (!res.ok) throw new Error(String(res.status));
			status = 'sent';
			form.reset();
			message = '';
		} catch {
			status = 'error';
		}
	}
</script>

<form class="form" method="post" action="/api/contact" onsubmit={submit} novalidate>
	<div class="field">
		<label for="c-name">{d.sections.contact.name}</label>
		<input id="c-name" name="name" type="text" autocomplete="name" placeholder=" " required maxlength="120" />
	</div>
	<div class="field">
		<label for="c-email">{d.sections.contact.email}</label>
		<input
			id="c-email"
			name="email"
			type="email"
			autocomplete="email"
			placeholder=" "
			required
			maxlength="200"
		/>
	</div>
	<div class="field field--wide">
		<label for="c-message">{d.sections.contact.message}</label>
		{#if showCounter}
			<span class="counter" class:over={overLimit} aria-live="polite" transition:fade={{ duration: 160 }}>
				{message.length}/{MESSAGE_MAX}
			</span>
		{/if}
		<textarea
			id="c-message"
			name="subject"
			rows="3"
			placeholder=" "
			required
			aria-invalid={overLimit}
			bind:value={message}></textarea>
	</div>

	<!-- Honeypot: humanos não veem, bots preenchem. -->
	<div class="trap" aria-hidden="true">
		<label for="c-website">Website</label>
		<input id="c-website" name="website" type="text" tabindex="-1" autocomplete="off" />
	</div>

	{#if PUBLIC_TURNSTILE_SITE_KEY}
		<div
			class="cf-turnstile field--wide"
			data-sitekey={PUBLIC_TURNSTILE_SITE_KEY}
			data-size="flexible"
			use:turnstile
		></div>
	{/if}

	<div class="actions field--wide">
		<p class="reply-time">
			<Icon name="zap" size={14} filled />
			{d.sections.contact.replyTime}
		</p>
		<p class="status" role="status" aria-live="polite">
			{#if status === 'sent'}{d.sections.contact.sent}{/if}
			{#if status === 'error'}{d.sections.contact.error}{/if}
		</p>
		<button class="button" type="submit" disabled={status === 'sending' || overLimit}>
			{status === 'sending' ? d.sections.contact.sending : d.sections.contact.send}
		</button>
	</div>
</form>

<style>
	.form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-4) var(--sp-6);
		align-items: end;
	}
	.field {
		display: grid;
		gap: var(--sp-2);
		/* Âncora do contador do assunto. */
		position: relative;
	}
	.field--wide {
		grid-column: 1 / -1;
	}
	label {
		font-weight: var(--w-heavy);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		display: flex;
		align-items: baseline;
		gap: var(--sp-3);
		flex-wrap: wrap;
	}
	/* Fora do fluxo, ancorado na linha do rótulo: aparecer não empurra nada. */
	.counter {
		position: absolute;
		top: 0;
		right: 0;
		font-weight: var(--w-regular);
		font-size: var(--fs-xs);
		line-height: 1;
		color: var(--surface);
		background: var(--ink);
		letter-spacing: 0;
		font-variant-numeric: tabular-nums;
		padding: 0.25em 0.5em;
	}
	.counter.over {
		background: var(--danger);
	}
	input,
	textarea {
		width: 100%;
		padding: 0.5em 0.4em;
		background: transparent;
		border: 0;
		border-bottom: 2px solid var(--ink);
		font-size: var(--fs-md);
		font-weight: var(--w-regular);
		transition:
			box-shadow var(--dur) var(--ease-out),
			background-color var(--dur) var(--ease-out);
	}
	/* Com foco ou preenchido: fundo branco fraco desfocando o desenho atrás. */
	input:focus,
	input:not(:placeholder-shown),
	textarea:focus,
	textarea:not(:placeholder-shown) {
		background: rgb(255 255 255 / 0.4);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	/* O traço grosso da direção de arte, mas em --ink: o --shadow dava 1.66:1,
	   abaixo dos 3:1 que a WCAG 1.4.11 exige pro indicador de foco. */
	input:focus-visible,
	textarea:focus-visible {
		outline: none;
		box-shadow: 0 4px 0 var(--ink);
	}
	/* Cresce só na vertical e nunca estoura a coluna do grid. */
	/* Altura fixa de 3 linhas: não cresce nem encolhe com o conteúdo. */
	textarea {
		font-family: inherit;
		resize: none;
		height: calc(3lh + 1em);
	}
	.trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--sp-4) var(--sp-6);
		flex-wrap: wrap;
		margin-top: var(--sp-2);
	}
	/* Selo escuro translúcido: desfoca o desenho atrás em vez de cobrir. */
	.reply-time {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		color: var(--ink);
		background: color-mix(in srgb, var(--shadow) 45%, transparent);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		padding: 0.35em 0.7em;
		font-size: var(--fs-xs);
		font-weight: var(--w-regular);
	}
	/* Raio treme rápido e volta ao repouso; o ciclo inteiro dura 2s. */
	.reply-time :global(svg) {
		flex: none;
		animation: zap-shake 2s ease-in-out infinite;
	}
	@keyframes zap-shake {
		0%,
		12%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		2% {
			transform: translateX(-1px) rotate(-9deg);
		}
		4% {
			transform: translateX(1px) rotate(9deg);
		}
		6% {
			transform: translateX(-1px) rotate(-7deg);
		}
		8% {
			transform: translateX(1px) rotate(7deg);
		}
		10% {
			transform: translateX(-0.5px) rotate(-3deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reply-time :global(svg) {
			animation: none;
		}
	}
	.button {
		font-size: var(--fs-md);
	}
	.button:disabled {
		opacity: 0.6;
		transform: none;
		box-shadow: var(--shadow-md);
	}
	/* margin auto empurra o status e o botão pro fim da linha. */
	.status {
		margin-inline-start: auto;
		text-align: end;
		font-weight: var(--w-regular);
		min-height: 1.5em;
	}
	@media (max-width: 40rem) {
		.form {
			grid-template-columns: 1fr;
		}
	}
</style>
