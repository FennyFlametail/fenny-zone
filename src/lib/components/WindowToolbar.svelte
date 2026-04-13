<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLMenuAttributes } from 'svelte/elements';

	interface WindowToolbarProps extends HTMLMenuAttributes {
		children: Snippet;
	}

	// eslint-disable-next-line svelte/valid-compile
	const { children, class: className, ...rest }: WindowToolbarProps = $props();
</script>

<menu
	class={['windowToolbar', 'brushedNoInset', className]}
	role="toolbar"
	data-allow-window-drag
	{...rest}
>
	{@render children()}
</menu>

<style>
	.windowToolbar {
		grid-area: toolbar;
		display: grid;
		grid-auto-flow: column;
		justify-content: start;
		justify-items: start;
		padding-top: 5px;
		padding-bottom: 11px;
		padding-inline: var(--titlebar-padding);
		gap: 10px;
		list-style: none;

		:global(.window.brushed) & {
			padding-inline: 0;
		}

		:global(.window.unified) & {
			border-bottom: 1px solid var(--window-titlebar-border-color);

			&:not(:global(.window.inactive) .windowToolbar) {
				background: linear-gradient(to bottom, #e5e5e5, #d5d5d5);
			}
		}
	}
</style>
