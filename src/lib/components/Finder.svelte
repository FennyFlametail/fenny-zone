<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setFileIconContext } from '$lib/context';

	const { children }: { children: Snippet } = $props();

	let selected = $state<string>();
	const getSelected = () => selected;
	const onselect = (name: string) => (selected = name);
	setFileIconContext(getSelected, onselect);
</script>

<div class="finder">
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
