<script lang="ts">
	import type { Snippet } from 'svelte';

	function menuHover(e: PointerEvent) {
		let isOpenMenu = menubar.querySelector('details[open]');
		if (!isOpenMenu) return;
		const details = e.currentTarget as HTMLDetailsElement;
		if (!details.open) {
			// open this menu, which will close the currently open one
			details.open = true;
		}
	}

	const {
		menubar,
		title,
		isLogo,
		children
	}: {
		menubar: HTMLElement;
		title: string;
		isLogo?: boolean;
		children?: Snippet;
	} = $props();
</script>

<details class="menuCategory" name="menubar" onpointerenter={menuHover}>
	<summary class="menuName">
		<span class={{ menuLogo: isLogo }}>{title}</span>
	</summary>
	<menu class="menu">
		{@render children?.()}
	</menu>
</details>

<style>
	.menuCategory {
		cursor: default;

		&:not([open])::details-content {
			content-visibility: visible;
			transition-property: opacity, display;
			transition-duration: 0.1s;
			transition-behavior: allow-discrete;
			opacity: 0;
			display: none;
			pointer-events: none;
		}

		&:is([open] ~ &, :global(:has(~ [open])))::details-content {
			transition: none;
		}
	}

	.menuName {
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1;
		padding-inline: var(--menu-item-padding);
		list-style-type: none;

		&:active,
		&:focus-visible,
		[open] & {
			@media (forced-colors: none) {
				outline: none;
				background: var(--accent-color);
				color: white;
			}
		}

		&::-webkit-details-marker {
			display: none;
		}
	}

	.menu {
		position: absolute;
		padding: 4px 0;
		list-style-type: none;
		box-shadow: var(--panel-box-shadow);

		@media (forced-colors: active) {
			border: 1px solid ButtonBorder;
			/* TODO fix text color */
			background-color: Canvas;
		}

		&::before {
			/* background on separate layer to control opacity */
			position: absolute;
			top: 0;
			left: 0;
			background: white;
			width: 100%;
			height: 100%;
			content: '';
		}
	}
</style>
