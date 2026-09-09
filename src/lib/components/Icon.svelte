<script lang="ts">
	type Name =
		'linkedin' | 'github' | 'instagram' | 'mail' | 'arrow' | 'external' | 'copy' | 'check' | 'zap' | 'pin';
	// `filled` troca o traço pelo preenchimento sólido (zap e pin).
	let { name, size = 20, filled = false }: { name: Name; size?: number; filled?: boolean } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={filled ? 'currentColor' : 'none'}
	stroke={filled ? 'none' : 'currentColor'}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'linkedin'}
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect x="2" y="9" width="4" height="12" />
		<circle cx="4" cy="4" r="2" />
	{:else if name === 'github'}
		<path
			d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
		/>
	{:else if name === 'instagram'}
		<rect x="2" y="2" width="20" height="20" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
	{:else if name === 'mail'}
		<rect x="2" y="4" width="20" height="16" rx="1" />
		<path d="m2 7 10 7 10-7" />
	{:else if name === 'arrow'}
		<path d="M5 12h14M13 5l7 7-7 7" />
	{:else if name === 'external'}
		<path d="M7 17 17 7M8 7h9v9" />
	{:else if name === 'copy'}
		<rect x="9" y="9" width="13" height="13" rx="1" />
		<path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
	{:else if name === 'check'}
		<path d="m5 12 5 5L20 7" />
	{:else if name === 'zap'}
		<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
	{:else if name === 'pin'}
		{#if filled}
			<!-- Gota sólida com o furo do centro recortado pelo evenodd. -->
			<path
				fill-rule="evenodd"
				d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
			/>
		{:else}
			<path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
			<circle cx="12" cy="11" r="2.5" />
		{/if}
	{/if}
</svg>
