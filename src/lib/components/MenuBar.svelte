<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppEntry, AppName } from '$lib/apps.svelte';
	import GooglyEyes from '$lib/components/GooglyEyes.svelte';
	import MenuCategory from '$lib/components/MenuCategory.svelte';
	import MenuClock from '$lib/components/MenuClock.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();
	const focusedApp = $derived(windowServer.focusedApp?.app);
	const appMenuTitle = $derived.by(() => {
		if (!focusedApp) return windowServer.apps.finder.title;
		if (focusedApp.parent) {
			const parent = windowServer.apps[focusedApp.parent];
			return parent.menuTitle ?? parent.title;
		}
		return focusedApp.menuTitle ?? focusedApp.title;
	});
	const isFinder = $derived(
		!focusedApp || focusedApp === windowServer.apps.finder || focusedApp?.parent === 'finder'
	);
	const runningAppsCount = $derived(Object.keys(windowServer.runningApps).length);

	let menubar = $state<HTMLElement>();

	function getWindowMenuTitle(app: AppEntry) {
		const defaultTitle = app.windowTitle ?? app.title;
		const instanceTitle = app.instance?.windowTitle;
		const parent = app.parent ? windowServer.apps[app.parent] : undefined;
		if (instanceTitle) {
			return `${instanceTitle} - ${parent?.title ?? defaultTitle}`;
		} else if (parent) {
			return `${defaultTitle} - ${parent.title}`;
		}
		return defaultTitle;
	}
</script>

<div class="menubarShadow"></div>

<header bind:this={menubar} class="menubar" role="menubar">
	<MenuCategory {menubar} title="🦊" isLogo={true} noScript={true}>
		<MenuItem href="https://github.com/FennyFlametail/fenny-zone" newTab={true} noScript={true}
			>View Source...</MenuItem
		>
		<hr class="noJS-hide" />
		<MenuItem onclick={() => windowServer.openApp('systemPreferences')}
			>System Preferences...</MenuItem
		>
	</MenuCategory>
	<MenuCategory {menubar} title={appMenuTitle} isAppMenu={true} noScript={true}>
		<MenuItem
			onclick={() => windowServer.closeApp(windowServer.focusedApp?.name)}
			href={!browser ? '/' : undefined}
			disabled={browser && windowServer.desktopFocused}
			noScript={true}>Close Window</MenuItem
		>
		<hr class="noJS-hide" />
		<MenuItem
			onclick={() => windowServer.closeAppAndChildren(windowServer.focusedApp?.name)}
			disabled={browser && windowServer.desktopFocused}
			noScript={false}>{isFinder ? 'Close All' : `Quit ${appMenuTitle}`}</MenuItem
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
			{#each Object.entries(windowServer.runningApps) as [appName, app]}
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
		flex-shrink: 0;
		display: flex;
		z-index: 10000;
		padding-inline: 20px;
		border-top-right-radius: 9px;
		border-top-left-radius: 9px;
		background: var(--menubar-bg-image);
		-webkit-user-select: none;
		user-select: none;

		hr {
			position: relative;
			margin-block: 5px;
			border: none;
			height: 1px;
			background-color: #ccced1;
		}
	}

	.menubarSpacer {
		flex-grow: 1;
	}
</style>
