<script lang="ts">
	import { type AppName } from '$lib/apps.svelte';
	import DockIcon from '$lib/components/DockIcon.svelte';
	import { getRunningApps } from '$lib/windowServer.svelte';

	const appsByParent = $derived(
		Map.groupBy(Object.entries(getRunningApps()), ([, app]) => app.parent)
	);
</script>

<footer class="dock">
	<div class="dockSection">
		<DockIcon appName="Finder" open={true} />
		{#each appsByParent as [parent, apps] (parent)}
			{#if parent}
				{#if parent !== 'Finder'}
					<DockIcon appName={parent} />
				{/if}
			{:else}
				{#each apps as [name]}
					<DockIcon appName={name as AppName} />
				{/each}
			{/if}
		{/each}
	</div>
	<div class="dockSection">
		<DockIcon appName="characters" open={false} />
		<DockIcon appName="projects" open={false} />
		<DockIcon appName="Trash" open={false} />
	</div>
</footer>

<style>
	.dock {
		--padding: 7.5px;
		--icon-size: 64px;
		z-index: 10000;
		position: fixed;
		bottom: 0;
		left: 50%;
		translate: -50%;
		display: flex;
		gap: 1px;
		height: calc(var(--icon-size) + var(--padding) * 2);
		box-shadow: 0 0 0 1px #00000026;
	}

	.dockSection {
		position: relative;
		display: flex;
		align-items: flex-end;
		padding-block: var(--padding);
		background-color: #ffffff66;
		border: 1px solid #ffffff26;

		&:first-child {
			padding-inline-start: calc(var(--padding) / 2);

			:global(.dockIcon:last-child) {
				/* extend the icon a bit to cover the gap between dock sections */
				padding-inline-end: calc(var(--padding) + 2px);
				margin-inline-end: -2px;
			}
		}

		&:last-child {
			padding-inline-end: calc(var(--padding) / 2);

			:global(.dockIcon:first-child) {
				padding-inline-start: calc(var(--padding) + 1px);
				margin-inline-start: -1px;
			}
		}
	}
</style>
