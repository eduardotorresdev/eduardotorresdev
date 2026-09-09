<script lang="ts">
	// Imagem de espera com hachura. Substituir por print real quando houver.
	let { label = 'imagem', ratio = '16 / 9' }: { label?: string; ratio?: string } = $props();
</script>

<figure class="ph" style:aspect-ratio={ratio} role="img" aria-label={label}>
	<span>{label}</span>
</figure>

<style>
	.ph {
		display: grid;
		place-items: center;
		width: 100%;
		margin: 2.4em 0;
		border: var(--border);
		box-shadow: var(--shadow-md);
		background: repeating-linear-gradient(45deg, var(--bg) 0 10px, var(--surface) 10px 20px);
	}
	span {
		padding: 0.2em 0.6em;
		background: var(--surface);
		border: var(--border);
		font-size: var(--fs-xs);
		font-weight: var(--w-regular);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
</style>
