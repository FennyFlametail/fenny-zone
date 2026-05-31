<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName, AppProps } from '$lib/apps.svelte';
	import AppLink from '$lib/components/AppLink.svelte';
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import NavigationStack from '$lib/helpers/navigationStack.svelte';
	import HomeIcon from '$lib/images/icons/home.webp';
	import { onMount } from 'svelte';

	const { folder: folderProp }: AppProps<'finder'> = $props();

	const windowServer = getWindowServerContext();
	const { app } = getAppContext<'finder'>();

	const navStack = new NavigationStack<AppName>(folderProp ?? 'home', onFolderChange);
	$effect(() => {
		if (folderProp) navStack.push(folderProp);
	});
	let folder = $derived(windowServer.apps[navStack.current]);

	async function onFolderChange() {
		app.instance.props.folder = navStack.current;
		app.instance.windowTitle = folder.title;
		app.instance.titleIcon = folder.icon;
	}
	onFolderChange();

	let remainingSpace = $state('∞');
	onMount(async () => {
		try {
			const estimate = await navigator.storage.estimate();
			if (estimate.quota === undefined || estimate.usage === undefined) return;
			remainingSpace = ((estimate.quota - estimate.usage) / 1_000_000_000).toFixed(2);
		} catch {}
	});
</script>

<div class="finder brushedNoInset">
	<WindowToolbar>
		<div class="aqua-button-group" role="group">
			{#if !browser && windowServer.focusedApp?.app.backTo}
				<a
					class="aqua-button square back"
					role="button"
					title="Back"
					aria-label="Back"
					href={windowServer.focusedApp?.app.backTo}
				></a>
			{:else}
				<button
					class="aqua-button square back"
					title="Back"
					aria-label="Back"
					disabled={!navStack.hasBack}
					onclick={navStack.back}
				></button>
			{/if}
			<button
				class="aqua-button square forward"
				title="Forward"
				aria-label="Forward"
				disabled={!navStack.hasForward}
				onclick={navStack.forward}
			></button>
		</div>
		<AppLink class="noJS-pointer" appName="home" title="Home" aria-label="Home">
			<img
				class="finderToolbarHome"
				src={HomeIcon}
				alt=""
				width={32}
				height={32}
				aria-hidden="true"
				draggable="false"
			/>
		</AppLink>
	</WindowToolbar>
	<nav class="finderIcons brushedInset" aria-label="Icons">
		<folder.Page />
	</nav>
	<footer class="finderStatusBar" data-allow-window-drag>
		<span class="finderItemCount" data-allow-window-drag></span>, {remainingSpace} GB available
	</footer>
</div>

<style>
	.finder {
		counter-reset: iconCount itemsLabel;
		display: flex;
		flex-direction: column;
	}

	.finderToolbarHome {
		-webkit-user-select: none;
		user-select: none;

		&:active,
		&:focus-visible {
			filter: brightness(0.5);
		}
	}

	.finderIcons {
		flex-grow: 1;
		display: grid;
		grid-template-columns: repeat(auto-fill, 128px);
		justify-content: space-evenly;
		align-content: start;
		align-items: start;
		padding: 10px;
		row-gap: 42px;
		background-color: white;
		overflow: hidden auto;

		> :global(*) {
			counter-increment: iconCount;
		}

		> :global(:first-child:last-child) {
			counter-increment: iconCount itemsLabel;
		}
	}

	.finderStatusBar {
		position: absolute;
		top: 100%;
		width: 100%;
		height: var(--window-brushed-bottom-padding);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		line-height: var(--window-brushed-bottom-padding);
		text-shadow: var(--window-brushed-text-shadow);
		-webkit-user-select: none;
		user-select: none;
	}

	.finderItemCount::before {
		content: counter(iconCount) ' ' counter(itemsLabel, itemsLabelStyle);
	}

	@counter-style itemsLabelStyle {
		system: fixed 0;
		symbols: 'items' 'item';
		speak-as: words;
	}
</style>
