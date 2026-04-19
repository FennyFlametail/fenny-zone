<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	const {
		menubar,
		title,
		isLogo,
		isAppMenu,
		noScript,
		children
	}: {
		menubar: HTMLElement;
		title: string;
		isLogo?: boolean;
		isAppMenu?: boolean;
		/** Show even if JavaScript is unavailable */
		noScript?: boolean;
		children?: Snippet;
	} = $props();
	const menuId = $props.id();

	const nameTag = $derived(isAppMenu ? 'h1' : 'span');
	const label = $derived(isLogo ? 'System' : title);

	let button = $state<HTMLButtonElement>();
	let menu = $state<HTMLMenuElement>();
	function menuHover() {
		if (navigator.userAgent.includes('iPhone')) return;
		let anyMenuOpen = menubar.querySelector('.aqua-menu:popover-open');
		// @ts-expect-error
		if (anyMenuOpen) menu!.showPopover({ source: button });
	}
	function showPopoverTouch(e: TouchEvent) {
		// this fixes unreliable button taps in MobileSafari (thanks Apple),
		// at the cost of not being able to close the menu by tapping the category
		e.preventDefault();
		// @ts-expect-error
		menu!.togglePopover({ source: button });
	}
</script>

{#if browser || noScript}
	<button
		bind:this={button}
		class="menuCategory"
		popovertarget={menuId}
		onpointerenter={menuHover}
		ontouchend={showPopoverTouch}
	>
		<svelte:element
			this={nameTag}
			class={['menuName', { menuLogo: isLogo, menuApp: isAppMenu }]}
			aria-label="{label} Menu">{title}</svelte:element
		>
		<menu bind:this={menu} id={menuId} class="aqua-menu" aria-label="Menu Items" popover>
			{@render children?.()}
		</menu>
	</button>
{/if}

<style>
	.menuCategory {
		background: none;
		border: none;
		padding: 0;
		/* this covers up a flicker in Safari when opening/closing menu  */
		transition: 0s 0.05s step-start allow-discrete;
		transition-property: background, color;

		&:active,
		&:focus-visible,
		&:has(.aqua-menu:popover-open) {
			outline: none;
			background: var(--menu-category-active-bg-image);
			color: white;
			transition-delay: 0s;
		}
	}

	.menuName {
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1;
		padding-inline: var(--menu-category-padding);
	}

	.menuLogo {
		background: var(--menu-logo-bg-image);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;

		.menuCategory:active &,
		.menuCategory:focus-visible &,
		.menuCategory:has(.aqua-menu:popover-open) & {
			background-image: none;
			background-color: white;
		}
	}

	.menuApp {
		font-size: inherit;
		font-weight: bold;
	}

	.aqua-menu {
		/* NOTE: position-area is buggy in MobileSafari as of iOS 26.4, but fallbacks don't seem to work with inset properties */
		position-area: bottom center;
		justify-self: start;

		/* don't transition when moving mouse between menus */
		:global(.menuCategory:has(> .aqua-menu:popover-open)) ~ .menuCategory > &,
		.menuCategory:has(+ .menuCategory > .aqua-menu:popover-open) > & {
			transition: none;
		}
	}
</style>
