<script lang="ts">
	import type { AppName, AppProps } from '$lib/apps.svelte';
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import NavigationStack from '$lib/helpers/navigationStack.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import { fade } from 'svelte/transition';

	const { pane: paneProp }: AppProps<'systemPreferences'> = $props();

	const windowServer = getWindowServerContext();
	const { app, appName } = getAppContext('systemPreferences');

	const prefPanes: AppName[] = ['prefsDesktop'];

	const navStack = new NavigationStack<AppName | undefined>(paneProp, onPaneChange);
	$effect(() => {
		if (paneProp) navStack.push(paneProp);
	});
	let pane = $derived(navStack.current ? windowServer.apps[navStack.current] : undefined);

	let transition = $state(false);

	function onPaneChange() {
		app.instance.props.pane = navStack.current;
		app.instance.windowTitle = pane?.title;
		windowServer.setAnimating(appName);
		transition = true;
		app.instance.position.height = Math.min(
			pane?.defaultPosition?.height ?? app.defaultPosition!.height!,
			WindowServer.safeHeight
		);
	}
</script>

<div class={['systemPreferences', { transition }]}>
	<WindowToolbar>
		<div class="aqua-button-group" role="group">
			<button
				class="aqua-button square back"
				title="Back"
				aria-label="Back"
				disabled={!navStack.hasBack}
				onclick={navStack.back}
			></button>
			<button
				class="aqua-button square forward"
				title="Forward"
				aria-label="Forward"
				disabled={!navStack.hasForward}
				onclick={navStack.forward}
			></button>
		</div>
		<button class="aqua-button square" disabled={!pane} onclick={() => navStack.push(undefined)}
			>Show All</button
		>
	</WindowToolbar>
	{#if !pane}
		<div
			class="systemPreferencesHome"
			transition:fade={{ duration: 200 }}
			onintroend={() => (transition = false)}
			onoutroend={() => (transition = false)}
		>
			{#each prefPanes as name}
				{@const pane = windowServer.apps[name]}
				<button class="systemPreferencesIcon" onclick={() => navStack.push(name)}>
					<img src={pane.icon} alt="" aria-hidden="true" draggable="false" />
					<span>{pane.title}</span>
				</button>
			{/each}
		</div>
	{:else}
		<div class="systemPreferencesPane" transition:fade={{ duration: 200 }}>
			<pane.Page />
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
