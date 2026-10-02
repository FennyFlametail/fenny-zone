<script lang="ts">
	import { browser } from '$app/environment';
	import { type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

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
	const label = $derived(isLogo ? 'Apple Menu' : title);

	let button = $state<HTMLButtonElement>();
	let menu = $state<HTMLMenuElement>();

	let hover = $derived(new MediaQuery('hover: hover', false).current);

	function onclick(e: MouseEvent) {
		e.preventDefault();
	}

	function onpointerenter() {
		if (!hover) return;
		let anyMenuOpen = menubar.querySelector('.aqua-menu:popover-open');
		if (anyMenuOpen) menu!.showPopover({ source: button });
	}

	let pointerDownTime = $state(0);

	function onpointerdown(e: PointerEvent) {
		if (menu?.contains(e.target as Node)) return;
		pointerDownTime = Date.now();
		menu!.togglePopover({ source: button });
	}

	function onpointerup(e: PointerEvent) {
		if (menu?.contains(e.target as Node)) return;
		if (Date.now() - pointerDownTime > 500) {
			menu!.hidePopover();
		}
	}
</script>

{#if browser || noScript}
	<button
		bind:this={button}
		class="menuCategory"
		popovertarget={menuId}
		{onclick}
		{onpointerenter}
		{onpointerdown}
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

<svelte:body {onpointerup} />

<style>
	.menuCategory {
		background: none;
		border: none;
		padding: 0;

		&:active:hover,
		&:focus-visible,
		&:has(.aqua-menu:popover-open) {
			outline: none;
			background: var(--menu-category-active-bg-image);
			color: white;

			.menuLogo {
				background-image: none;
				background-color: white;
			}
		}
	}

	.menuName {
		display: flex;
		align-items: center;
		height: 100%;
		padding-inline: var(--menu-category-padding);
		line-height: 1;
		white-space: nowrap;
	}

	.menuLogo {
		background: var(--menu-logo-bg-image);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
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
