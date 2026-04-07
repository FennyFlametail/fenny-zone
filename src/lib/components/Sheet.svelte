<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { trapFocus } from 'trap-focus-svelte';

	const { app } = getAppContext();

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
			use:trapFocus={app.instance.focused}
			transition:fly|global={{
				duration: WindowServer.sheetDuration,
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
		top: var(--titlebar-height);
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
		border-top: 1px solid rgb(0 0 0 / 50%);

		:global(:where(h3, p)) {
			font-size: 16px;
			line-height: 1.4;
			text-wrap: pretty;
		}
	}
</style>
