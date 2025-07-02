<script lang="ts">
	import type { Snippet } from 'svelte';
	const { image, children }: { image: string; children: Snippet } = $props();
</script>

<div class="character" style:--image={`url('${image}')`}>
	{@render children()}
</div>

<style>
	.character {
		position: relative;
		width: 100%;
		height: 100%;
		padding-block: 0.5rem;
		overflow-y: scroll;
		background-image: var(--image);
		background-size: auto 100%;
		background-position: right;
		background-repeat: no-repeat;
	}
</style>
