<script lang="ts">
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import DesktopPrefs from '$lib/components/prefpanes/DesktopPrefs.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import DesktopIcon from '$lib/images/icons/desktop.webp';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const windowServer = getWindowServerContext();
	const { app } = getAppContext();

	const DEFAULT_HEIGHT = 200;

	onMount(() => {
		// restore default height in case page was reloaded with a pane open
		// this also helps initially position the app better
		app.instance.position.height = DEFAULT_HEIGHT;
	});

	const prefPanes = {
		Desktop: {
			component: DesktopPrefs,
			icon: DesktopIcon,
			height: 500
		}
	};
	type paneName = keyof typeof prefPanes;

	let navStack: (paneName | null)[] = $state([null]);
	let navIndex = $state(0);
	let activePane = $derived(navStack[navIndex]);
	let transition = $state(false);

	function onPaneChange() {
		app.instance.title = activePane || app.title;
		windowServer.setAnimating(app);
		transition = true;
		app.instance.position.height = activePane ? prefPanes[activePane].height : DEFAULT_HEIGHT;
	}

	function openPane(pane: paneName | null) {
		navStack = navStack.slice(0, navIndex + 1);
		navStack.push(pane);
		navIndex++;
		onPaneChange();
	}

	function back() {
		if (navIndex === 0) return;
		navIndex--;
		onPaneChange();
	}

	function forward() {
		if (navIndex === navStack.length - 1) return;
		navIndex++;
		onPaneChange();
	}
</script>

<div class={['systemPreferences', { transition }]}>
	<WindowToolbar>
		<div class="aqua-button-group" role="group">
			<button
				class="aqua-button square back"
				aria-label="Back"
				disabled={navIndex === 0}
				onclick={back}
			></button>
			<button
				class="aqua-button square forward"
				aria-label="Forward"
				disabled={navIndex === navStack.length - 1}
				onclick={forward}
			></button>
		</div>
		<button class="aqua-button square" disabled={activePane === null} onclick={() => openPane(null)}
			>Show All</button
		>
	</WindowToolbar>
	{#if !activePane}
		<div
			class="systemPreferencesHome"
			transition:fade={{ duration: 200 }}
			onintroend={() => (transition = false)}
			onoutroend={() => (transition = false)}
		>
			{#each Object.entries(prefPanes) as [name, info]}
				<button class="systemPreferencesIcon" onclick={() => openPane(name as paneName)}>
					<img src={info.icon} alt="" aria-hidden="true" draggable="false" />
					<span>{name}</span>
				</button>
			{/each}
		</div>
	{:else}
		{@const Component = prefPanes[activePane].component}
		<div class="systemPreferencesPane" transition:fade={{ duration: 200 }}>
			<Component />
		</div>
	{/if}
</div>

<style>
	.systemPreferences {
		position: relative;
		display: grid;
		grid-template:
			'toolbar' auto
			'content' 1fr;
		overflow: hidden;
	}

	.systemPreferencesHome,
	.systemPreferencesPane {
		grid-area: content;
		display: grid;
		overflow-y: auto;
	}

	.systemPreferencesHome {
		grid-template-columns: repeat(auto-fill, 110px);
		justify-content: space-evenly;
		align-content: center;
		row-gap: 50px;
	}

	.systemPreferencesIcon {
		background: none;
		border: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-size: 15px;
		line-height: 1.3;
		text-align: center;
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: none;

			img {
				filter: var(--focus-drop-shadow);
			}
			span {
				box-shadow: var(--focus-box-shadow);
				border-radius: 2px;
			}
		}

		img {
			width: 42px;
			height: 42px;
		}

		&:active img {
			filter: brightness(0.5);
		}
	}
</style>
