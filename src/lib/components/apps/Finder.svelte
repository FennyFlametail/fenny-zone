<script lang="ts">
	import type { Snippet } from 'svelte';
	import setupFileIconContainer from '$lib/helpers/fileIconContainer.svelte';

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
		background-color: white;
		display: flex;
		flex-direction: column;
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
		padding: 10px;
		row-gap: 42px;
		overflow: hidden auto;
	}
</style>
