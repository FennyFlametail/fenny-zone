<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';
	import { trapFocus } from 'trap-focus-svelte';

	const windowServer = getWindowServerContext();
	const { getFocused } = getAppContext();
	const focused = $derived(getFocused());

	/* sheet should make all controls in window appear disabled without
	disabling the window itself, but doesn't matter for Bluesky */

	const {
		open,
		children
	}: {
		open: boolean;
		children: Snippet;
	} = $props();

	const transitionDuration = $derived(windowServer.reduceMotion ? 0 : 250);

	let render = $state(false);
	let closeTimeout: number;
	$effect(() => {
		if (open) {
			render = true;
			clearTimeout(closeTimeout);
		} else {
			closeTimeout = setTimeout(() => (render = false), transitionDuration);
		}
	});
</script>

{#if render}
	<div class={['sheet', { open }]} style:--transition-duration={`${transitionDuration}ms`}>
		<div class="sheetWrapper" use:trapFocus={focused}>
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
		animation: slideOut var(--transition-duration) both;

		.sheet.open & {
			animation-name: slideIn;
		}

		@media (prefers-reduced-motion: reduce) {
			animation: none !important;
		}
	}

	@keyframes slideIn {
		from {
			translate: 0 -100%;
		}
		to {
			translate: 0;
		}
	}

	@keyframes slideOut {
		from {
			translate: 0;
		}
		to {
			translate: 0 -100%;
		}
	}
</style>
