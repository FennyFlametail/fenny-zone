<script lang="ts">
	import MenuCategory from '$lib/components/MenuCategory.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { closeAll, arrangeWindows } from '$lib/components/WindowServer.svelte';

	let menubar: HTMLElement;

	function dismissMenu(e: MouseEvent) {
		const openMenu = menubar.querySelector('details[open]');
		if (!openMenu) return;
		if (e.composedPath().some((el) => (el as Element).classList?.contains('menuName'))) {
			e.preventDefault();
		}
		// TODO flash menu item if clicked
		openMenu.removeAttribute('open');
	}
</script>

<div class="menubarShadow"></div>

<!-- TODO better keyboard navigation (inert?) -->
<header bind:this={menubar} class="menubar">
	<MenuCategory {menubar} title="🦊" isLogo={true}>
		<!-- TODO about screen -->
		<MenuItem title="About This Site" onclick={() => {}} />
	</MenuCategory>
	<MenuCategory {menubar} title="Window">
		<MenuItem title="Arrange Windows" onclick={arrangeWindows} />
		<MenuItem title="Close All Windows" onclick={closeAll} />
	</MenuCategory>
</header>

<svelte:body onclick={dismissMenu} />

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
		box-shadow: 0 -5px 10px 10px rgba(0, 0, 0, 0.5);
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
</style>
