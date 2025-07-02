<script lang="ts">
	import type { Snippet } from 'svelte';
	import setupFileIconContainer from '$lib/fileIconContainer.svelte';

	const { children }: { children: Snippet } = $props();

	const { onClickIconContainer } = setupFileIconContainer();

	let icons = $state<HTMLDivElement>();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="finder" onclick={onClickIconContainer}>
	<div class="finderStatusBar">{icons?.childElementCount ?? ''} items, ∞ GB available</div>
	<div class="finderIcons" bind:this={icons}>
		{@render children()}
	</div>
</div>

<style>
	.finder {
		min-height: 100%;
		background-color: white;
	}

	.finderStatusBar {
		height: 19px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid #8c8c8c;
		font-size: 12px;
		-webkit-user-select: none;
		user-select: none;
	}

	.finderIcons {
		display: grid;
		grid-template-columns: repeat(auto-fill, 128px);
		justify-content: space-evenly;
		align-content: start;
		row-gap: 42px;
		padding-block: 10px;
	}
</style>
