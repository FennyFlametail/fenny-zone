<script lang="ts">
	import type { Snippet } from 'svelte';
	import setupFileIconContainer from '$lib/fileIconContainer.svelte';

	const { children }: { children: Snippet } = $props();

	const { onClickIconContainer } = setupFileIconContainer();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="finder" onclick={onClickIconContainer}>
	<!-- TODO show icon in title bar -->
	{@render children()}
</div>

<style>
	.finder {
		min-height: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, 128px);
		justify-content: space-evenly;
		align-content: start;
		row-gap: 42px;
		padding-block: 10px;
		background-color: white;
	}
</style>
