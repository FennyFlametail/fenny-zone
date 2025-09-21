<script lang="ts">
	import GooglyEyes from '$lib/components/GooglyEyes.svelte';
	import MenuCategory from '$lib/components/MenuCategory.svelte';
	import MenuClock from '$lib/components/MenuClock.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { setMenubarContext } from '$lib/context';
	import { arrangeWindows, closeAll } from '$lib/windowServer.svelte';

	let menubar = $state<HTMLElement>();

	function dismissMenu() {
		const openMenu = menubar!.querySelector('details[open]');
		if (!openMenu) return false;
		openMenu.removeAttribute('open');
		return true;
	}
	setMenubarContext(dismissMenu);

	function dismissOnOutsideClick(e: MouseEvent) {
		const path = e.composedPath();
		if (path.some((el) => (el as Element).classList?.contains('menuItem'))) {
			// MenuItem will dismiss the menu after its animation plays
			return;
		}

		const dismissed = dismissMenu();

		if (dismissed && path.some((el) => (el as Element).classList?.contains('menuName'))) {
			// prevent the click from reaching the menu name and immediately reopening the menu
			e.preventDefault();
		}
	}
</script>

<div class="menubarShadow"></div>

<header bind:this={menubar} class="menubar">
	<MenuCategory {menubar} title="🦊" isLogo={true}>
		<MenuItem title="About This Site" onclick={() => {}} />
	</MenuCategory>
	<MenuCategory {menubar} title="Window">
		<MenuItem title="Arrange Windows" onclick={arrangeWindows} />
		<MenuItem title="Close All Windows" onclick={closeAll} />
	</MenuCategory>
	<div class="spacer"></div>
	<GooglyEyes />
	<MenuClock />
</header>

<svelte:body onclick={dismissOnOutsideClick} />

<style>
	.menubar,
	.menubarShadow {
		height: var(--menubar-height);
	}

	.menubarShadow {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		box-shadow: 0 -5px 10px 10px rgb(0 0 0 / 50%);
	}

	.menubar {
		--menu-item-padding: 10px;
		flex-shrink: 0;
		display: flex;
		z-index: 10000;
		background-color: white;
		padding-inline: 20px;
		-webkit-user-select: none;
		user-select: none;
	}

	.spacer {
		flex-grow: 1;
	}
</style>
