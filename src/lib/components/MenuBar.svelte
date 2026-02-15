<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppEntry, AppName } from '$lib/apps.svelte';
	import GooglyEyes from '$lib/components/GooglyEyes.svelte';
	import MenuCategory from '$lib/components/MenuCategory.svelte';
	import MenuClock from '$lib/components/MenuClock.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { getWindowServerContext, setMenubarContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();
	const focusedApp = $derived.by(() => {
		if (!browser && windowServer.initialAppName) {
			return windowServer.apps[windowServer.initialAppName];
		}
		return windowServer.focusedApp?.app as AppEntry | undefined;
	});
	const title = $derived.by(() => {
		if (!focusedApp) return windowServer.apps.Finder.title;
		if (focusedApp.parent) {
			const parent = windowServer.apps[focusedApp.parent];
			return parent.menuTitle ?? parent.title;
		}
		return focusedApp.menuTitle ?? focusedApp.title;
	});
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

	function getWindowMenuTitle(app: AppEntry) {
		let title = app.windowTitle ?? app.title;
		const parent = app.parent ? windowServer.apps[app.parent] : undefined;
		if (parent) {
			title = `${title} - ${parent.title}`;
		}
		return title;
	}
</script>

<div class="menubarShadow"></div>

<header bind:this={menubar} class="menubar">
	<MenuCategory {menubar} title="🦊" isLogo={true} noScript={true}>
		<MenuItem href="https://github.com/FennyFlametail/fenny-zone" newTab={true} noScript={true}
			>View Source...</MenuItem
		>
	</MenuCategory>
	<MenuCategory {menubar} {title} isAppMenu={true} noScript={true}>
		<MenuItem
			onclick={windowServer.closeCurrent}
			href={!browser ? (focusedApp?.backTo ?? '/') : undefined}
			disabled={browser && windowServer.desktopFocused}
			noScript={true}>Close Window</MenuItem
		>
	</MenuCategory>
	<MenuCategory {menubar} title="Window">
		<MenuItem
			onclick={() => windowServer.zoomApp(windowServer.focusedApp?.name)}
			disabled={windowServer.desktopFocused || windowServer.focusedApp?.app.noResize}>Zoom</MenuItem
		>
		<hr />
		<MenuItem onclick={windowServer.arrangeWindows} disabled={runningAppsCount === 0}
			>Arrange Windows</MenuItem
		>
		<MenuItem onclick={windowServer.closeAll} disabled={runningAppsCount === 0}
			>Close All Windows</MenuItem
		>
		<MenuItem
			onclick={windowServer.closeOthers}
			disabled={runningAppsCount < 2 && !(windowServer.desktopFocused && runningAppsCount === 1)}
			>Close Others</MenuItem
		>
		{#if runningAppsCount > 0}
			<hr />
			{#each Object.entries(windowServer.runningAppsByFocusOrder) as [appName, app]}
				<MenuItem
					onclick={() => windowServer.focusApp(appName as AppName)}
					checked={app === focusedApp}
				>
					{getWindowMenuTitle(app)}</MenuItem
				>
			{/each}
		{/if}
	</MenuCategory>
	<div class="menubarSpacer"></div>
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

	.menubarSpacer {
		flex-grow: 1;
	}
</style>
