<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	const { children, class: className, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<footer class={['windowStatusBar', className]} data-allow-window-drag {...rest}>
	{@render children?.()}
</footer>

<style>
	.windowStatusBar {
		position: absolute;
		top: 100%;
		width: 100%;
		height: var(--window-brushed-bottom-padding);
		font-size: 14px;
		line-height: var(--window-brushed-bottom-padding);
		text-shadow: var(--window-brushed-text-shadow);
		-webkit-user-select: none;
		user-select: none;

		:global(.window.inactive) & {
			color: var(--text-secondary);
		}
	}
</style>
