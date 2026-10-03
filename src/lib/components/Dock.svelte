<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName, RunningApp } from '$lib/apps.svelte';
	import DockIcon from '$lib/components/DockIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();

	const pinnedLeft: AppName[] = ['finder', 'characters'];
	const pinnedRight: AppName[] = ['applications', 'trash'];
</script>

{#snippet runningAppIcons(parent: AppName | null, apps: [AppName, RunningApp][])}
	{#if parent}
		{#if !pinnedLeft.includes(parent) && !Object.keys(windowServer.runningApps).includes(parent)}
			<DockIcon appName={parent} />
		{/if}
	{:else}
		{#each apps as [name, app]}
			{#if !pinnedLeft.includes(name) && !app.hideInDock}
				<DockIcon appName={name} />
			{/if}
		{/each}
	{/if}
{/snippet}

<nav class="dock" aria-label="Dock">
	<div class="dockSection">
		{#each pinnedLeft as name}
			<DockIcon appName={name} />
		{/each}
		{#each windowServer.runningAppsByParent as [parent, apps] (parent)}
			{@render runningAppIcons(parent, apps)}
		{/each}
		{#if !browser && windowServer.initialAppName}
			{@const appName = windowServer.initialAppName}
			{@const app = windowServer.apps[appName]}
			{@render runningAppIcons(app.parent || null, [[appName, app as RunningApp]])}
		{/if}
	</div>
	<div class="dockSection">
		{#each pinnedRight as name}
			<DockIcon appName={name} open={false} />
		{/each}
	</div>
</nav>

<style>
	.dock {
		z-index: 10000;
		grid-area: dock;
		justify-self: center;
		max-inline-size: 100dvi;
		max-block-size: var(--dock-height);
		display: flex;
		gap: 1px;
		outline: 1px solid rgb(0 0 0 / 10%);

		:global(body.duoLayout) & {
			writing-mode: vertical-lr;
			justify-self: auto;
			align-self: center;
		}

		@media (prefers-reduced-transparency: reduce) {
			background-color: var(--desktop-color);
		}
	}

	.dockSection {
		min-inline-size: 0;
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
