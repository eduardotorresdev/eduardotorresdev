<script lang="ts">
	interface Image {
		src: string;
		alt: string;
		caption?: string;
	}
	let { images, columns = images.length > 2 ? 3 : 2 }: { images: Image[]; columns?: 2 | 3 } = $props();
</script>

<div class="gallery" style:--cols={columns}>
	{#each images as image (image.src)}
		<figure>
			<img src={image.src} alt={image.alt} loading="lazy" />
			{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
		</figure>
	{/each}
</div>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: var(--sp-6);
		margin: 2.4em 0;
	}
	figure {
		margin: 0;
	}
	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border: var(--border);
		box-shadow: var(--shadow-md);
	}
	figcaption {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--muted);
	}
	@media (max-width: 40rem) {
		.gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
