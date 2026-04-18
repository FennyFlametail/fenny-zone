<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName, RunningApp } from '$lib/apps.svelte';
	import DockIcon from '$lib/components/DockIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();

	const pinned: AppName[] = ['Finder', 'characters', 'bluesky', 'system-preferences'];
</script>

{#snippet runningApps(parent: AppName | null, apps: [AppName, RunningApp][])}
	{#if parent}
		{#if !pinned.includes(parent)}
			<DockIcon appName={parent} />
		{/if}
	{:else}
		{#each apps as [name, app]}
			{#if !pinned.includes(name) && !app.hideInDock}
				<DockIcon appName={name} />
			{/if}
		{/each}
	{/if}
{/snippet}

<nav class="dock" aria-label="Dock">
	<div class="dockSection">
		{#each pinned as name}
			<DockIcon appName={name} open={name === 'Finder' || undefined} />
		{/each}
		{#each windowServer.appsByParent as [parent, apps] (parent)}
			{@render runningApps(parent, apps)}
		{/each}
		{#if !browser && windowServer.initialAppName}
			{@const appName = windowServer.initialAppName}
			{@const app = windowServer.apps[appName]}
			{@render runningApps(app.parent || null, [[appName, app as RunningApp]])}
		{/if}
	</div>
	<div class="dockSection">
		<DockIcon appName="projects" open={false} />
		<DockIcon appName="trash" open={false} />
	</div>
</nav>

<style>
	.dock {
		z-index: 10000;
		grid-area: dock;
		justify-self: center;
		display: flex;
		gap: 1px;
		height: var(--dock-height);
		outline: 1px solid rgb(0 0 0 / 10%);
		/* fix incorrect sizing in Safari */
		max-height: calc(var(--dock-icon-size) + var(--dock-padding) * 2);

		@media (prefers-reduced-transparency: reduce) {
			background-color: var(--desktop-color);
		}
	}

	.dockSection {
		position: relative;
		display: flex;
		align-items: flex-end;
		padding-block: var(--dock-padding);
		background-color: #ffffff66;
		border: 1px solid #ffffff26;

		&:first-child {
			padding-inline-start: calc(var(--dock-padding) / 2);

			:global(.dockIcon:last-child) {
				/* extend the icon a bit to cover the gap between dock sections */
				padding-inline-end: calc(var(--dock-padding) + 2px);
				margin-inline-end: -2px;
			}
		}

		&:last-child {
			padding-inline-end: calc(var(--dock-padding) / 2);

			:global(.dockIcon:first-child) {
				padding-inline-start: calc(var(--dock-padding) + 1px);
				margin-inline-start: -1px;
			}
		}
	}
</style>
