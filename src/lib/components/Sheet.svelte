<script lang="ts">
	import { getAppContextUntyped } from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import type { Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import type { ClassValue } from 'svelte/elements';
	import { prefersReducedMotion } from 'svelte/motion';
	import { type TransitionConfig } from 'svelte/transition';
	import { trapFocus } from 'trap-focus-svelte';

	const { app } = getAppContextUntyped();

	const {
		isOpen,
		close,
		class: className,
		children
	}: {
		isOpen: boolean;
		close: () => void;
		class?: ClassValue;
		children: Snippet;
	} = $props();

	function appear(_: HTMLElement): TransitionConfig {
		return {
			duration: WindowServer.sheetDuration,
			easing: cubicInOut,
			css: (t, u) =>
				!prefersReducedMotion.current
					? `transform: perspective(1000px) rotateX(${90 * u}deg) scaleY(${t});`
					: `opacity: ${t}`
		};
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && app.instance.focused) close();
	}
</script>

{#if isOpen}
	<div class={['sheet', className]}>
		<div class="sheetWrapper" use:trapFocus={app.instance.focused} transition:appear|global>
			{@render children()}
		</div>
	</div>
{/if}
<svelte:body {onkeydown} />

<style>
	.sheet {
		position: absolute;
		top: var(--titlebar-height);
		left: 50%;
		translate: -50%;
		background: none;
		border: none;
		padding: 0 50px 10px;
		padding-top: 0;
		overflow: hidden;
	}

	.sheetWrapper {
		padding: 20px;
		box-shadow: var(--panel-box-shadow-inactive);
		border-top: 1px solid rgb(0 0 0 / 50%);
		transform-origin: top center;
	}
</style>
