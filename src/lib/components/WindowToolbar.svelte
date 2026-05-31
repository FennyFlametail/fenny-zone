<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	const { children, class: className, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<header
	class={['windowToolbar', 'brushedNoInset', className]}
	role="toolbar"
	data-allow-window-drag
	{...rest}
>
	{@render children?.()}
</header>

<style>
	.windowToolbar {
		grid-area: toolbar;
		display: grid;
		grid-auto-flow: column;
		justify-content: start;
		justify-items: start;
		align-items: center;
		padding-top: 5px;
		padding-bottom: 11px;
		padding-inline: var(--titlebar-padding);
		gap: 10px;
		list-style: none;

		:global(.window.brushed) & {
			padding-inline: 0;
		}

		:global(.window.unified) & {
			border-bottom: 1px solid var(--titlebar-border-color);

			&:not(:global(.window.inactive) .windowToolbar) {
				background: linear-gradient(to bottom, #e5e5e5, #d5d5d5);
			}
		}
	}
</style>
