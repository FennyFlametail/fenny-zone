<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName, RunningApp } from '$lib/apps.svelte';
	import Window from '$lib/components/Window.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();
</script>

<main class={['windowLayer', (windowServer.draggingEl || windowServer.resizingEl) && 'noSelect']}>
	{#each Object.entries(windowServer.runningApps) as [AppName, RunningApp][] as [appName, app], i (appName)}
		<Window {appName} props={app.instance?.props} />
	{/each}
	<noscript>
		{#if !browser && windowServer.initialAppName}
			<Window appName={windowServer.initialAppName} />
		{/if}
	</noscript>
</main>

<style>
	.windowLayer {
		grid-area: desktop;
		position: relative;
		display: grid;
		pointer-events: none; /* allow clicks to fall through to the desktop */

		> :global(*) {
			pointer-events: auto;
		}
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}

	noscript {
		display: none;

		@media (scripting: none) {
			display: contents;
		}
	}
</style>
