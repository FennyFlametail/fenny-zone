<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, type Snippet } from 'svelte';

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

	let isiPhone = $state(false);
	onMount(() => {
		setTimeout(() => {
			isiPhone = document.body.classList.contains('safari') && matchMedia('(hover: none)').matches;
		}, 100);
	});

	function onclick(e: MouseEvent) {
		if (isiPhone) return;
		e.preventDefault();
	}

	function onpointerenter() {
		if (isiPhone) return;
		let anyMenuOpen = menubar.querySelector('.aqua-menu:popover-open');
		if (anyMenuOpen) menu!.showPopover({ source: button });
	}

	let pointerDownTime = $state(0);

	function onpointerdown(e: PointerEvent) {
		if (isiPhone) return;
		if (menu?.contains(e.target as Node)) return;
		pointerDownTime = Date.now();
		menu!.togglePopover({ source: button });
	}

	function onpointerup() {
		if (isiPhone) return;
		if (Date.now() - pointerDownTime > 500) {
			menu!.hidePopover({ source: button });
		}
	}

	function ontouchend(e: TouchEvent) {
		if (!isiPhone) return;
		// fixes unreliable button taps in MobileSafari
		e.preventDefault();
		menu!.togglePopover({ source: button });
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
		{onpointerup}
		{ontouchend}
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

		&:active:hover,
		&:focus-visible,
		&:has(.aqua-menu:popover-open) {
			outline: none;
			background: var(--menu-category-active-bg-image);
			color: white;
			transition-delay: 0s;

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
