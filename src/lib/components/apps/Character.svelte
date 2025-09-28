<script lang="ts">
	import type { Snippet } from 'svelte';
	const { image, children }: { image: string; children: Snippet } = $props();
</script>

<div class="character" style:--image={`url('${image}')`}>
	<div class="container">
		{@render children()}
	</div>
</div>

<style>
	.character {
		position: relative;
		width: 100%;
		height: 100%;
		padding-block: 0.5rem;
		overflow-y: auto;
		background-color: white;
		/* images are resized to 512px high and 25% opacity */
		background-image: var(--image);
		background-size: auto 100%;
		background-position: right;
		background-repeat: no-repeat;
	}

	.container {
		max-width: 500px;
		text-wrap: pretty;
	}
</style>
