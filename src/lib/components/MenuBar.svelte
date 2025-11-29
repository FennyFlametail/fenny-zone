<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppEntry } from '$lib/apps.svelte';
	import GooglyEyes from '$lib/components/GooglyEyes.svelte';
	import MenuCategory from '$lib/components/MenuCategory.svelte';
	import MenuClock from '$lib/components/MenuClock.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { getWindowServerContext, setMenubarContext } from '$lib/context';

	const windowServer = getWindowServerContext();
	const app = $derived.by(() => {
		if (!browser && windowServer.initialAppName) {
			return windowServer.apps[windowServer.initialAppName];
		}
		return windowServer.focusedApp?.app as AppEntry | undefined;
	});
	const title = $derived(app?.menuTitle || app?.title || windowServer.apps.Finder.title);
	const runningAppsCount = $derived(Object.keys(windowServer.runningApps).length);

	let menubar = $state<HTMLElement>();

	function dismissMenu() {
		const openMenu = menubar!.querySelector('details[open]');
		if (!openMenu) return false;
		openMenu.removeAttribute('open');
		return true;
	}
	setMenubarContext({ dismissMenu });

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
	<MenuCategory {menubar} title="🦊" isLogo={true} noScript={true}>
		<MenuItem
			title="View Source..."
			href="https://github.com/FennyFlametail/fenny-zone"
			newTab={true}
			noScript={true}
		/>
	</MenuCategory>
	<!-- TODO fix flash of menu items when JS is disabled -->
	<MenuCategory {menubar} {title} isAppMenu={true} noScript={true}>
		<MenuItem
			title="Close Window"
			onclick={windowServer.closeCurrent}
			href={!browser ? app?.backTo : undefined}
			disabled={browser && (windowServer.desktopFocused || runningAppsCount === 0)}
			noScript={true}
		/>
	</MenuCategory>
	<MenuCategory {menubar} title="Window">
		<MenuItem
			title="Zoom"
			onclick={() => windowServer.zoomApp(windowServer.focusedApp?.name)}
			disabled={windowServer.desktopFocused || runningAppsCount === 0}
		/>
		<hr />
		<MenuItem
			title="Arrange Windows"
			onclick={windowServer.arrangeWindows}
			disabled={runningAppsCount === 0}
		/>
		<MenuItem
			title="Close All Windows"
			onclick={windowServer.closeAll}
			disabled={runningAppsCount === 0}
		/>
		<MenuItem
			title="Close Others"
			onclick={windowServer.closeOthers}
			disabled={runningAppsCount < 2 && !(windowServer.desktopFocused && runningAppsCount === 1)}
		/>
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

		hr {
			position: relative;
			margin-block: 5px;
			border: none;
			height: 2px;
			background: linear-gradient(to bottom, rgb(207 209 211) 50%, rgb(237 239 241) 50%);
		}
	}

	.spacer {
		flex-grow: 1;
	}
</style>
