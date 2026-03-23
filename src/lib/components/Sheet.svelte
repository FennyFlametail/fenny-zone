<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { trapFocus } from 'trap-focus-svelte';

	const { getFocused } = getAppContext();
	const focused = $derived(getFocused());

	/* sheet should make all controls in window appear disabled without
	disabling the window itself, but doesn't matter for Bluesky */

	const {
		isOpen,
		children
	}: {
		isOpen: boolean;
		children: Snippet;
	} = $props();
</script>

{#if isOpen}
	<div class="sheet">
		<div
			class="sheetWrapper"
			use:trapFocus={focused}
			transition:fly={{
				duration: 300,
				y: !prefersReducedMotion.current ? '-100%' : 0,
				opacity: !prefersReducedMotion.current ? 1 : 0
			}}
		>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.sheet {
		--shadow-padding: 10px;
		position: absolute;
		/* 1px covers up gaps caused by rounding */
		top: calc(var(--titlebar-height) - 1px);
		left: 50%;
		translate: -50%;
		background: none;
		border: none;
		padding: var(--shadow-padding);
		padding-top: 0;
		overflow: hidden;
	}

	.sheetWrapper {
		padding: 20px;
		box-shadow: var(--panel-box-shadow-inactive);
		margin-top: 1px;
	}
</style>
