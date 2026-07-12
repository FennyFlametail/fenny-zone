<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	const {
		selected,
		class: className,
		children,
		...rest
	}: {
		selected: boolean;
	} & HTMLAttributes<HTMLLIElement> = $props();
</script>

<li class={['windowSidebarItem', { selected }, className]} {...rest}>
	{@render children?.()}
</li>

<style>
	.windowSidebarItem {
		list-style: none;

		&.selected {
			background: var(--sidebar-item-bg-image);
			color: white;

			:global(.window:is(.inactive, .sheetOpen)) & {
				background: var(--sidebar-item-bg-image-inactive);
			}

			@media (forced-colors: active) {
				background-color: SelectedItem;
			}
		}

		&:focus-visible,
		&:global(:has(:focus-visible)) {
			outline: none;
			box-shadow: var(--focus-box-shadow);

			:global(*:focus-visible) {
				outline: none;
			}
		}
	}
</style>
