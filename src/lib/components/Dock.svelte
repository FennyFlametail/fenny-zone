<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import DockIcon from '$lib/components/DockIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();

	const pinned: AppName[] = ['Finder', 'characters', 'bluesky'];
</script>

<footer class="dock">
	<div class="dockSection">
		{#each pinned as name}
			<DockIcon appName={name} open={name === 'Finder' || undefined} />
		{/each}
		{#each windowServer.appsByParent as [parent, apps] (parent)}
			{#if parent}
				{#if !pinned.includes(parent)}
					<DockIcon appName={parent} />
				{/if}
			{:else}
				{#each apps as [name, app]}
					{#if !pinned.includes(name)}
						<DockIcon appName={name} />
					{/if}
				{/each}
			{/if}
		{/each}
	</div>
	<div class="dockSection">
		<DockIcon appName="projects" open={false} />
		<DockIcon appName="trash" open={false} />
	</div>
</footer>

<style>
	.dock {
		z-index: 10000;
		position: fixed;
		bottom: 0;
		left: 50%;
		translate: -50%;
		display: flex;
		gap: 1px;
		height: var(--dock-height);
		box-shadow: 0 0 0 1px #00000026;
		/* fix incorrect sizing in Safari */
		max-height: calc(var(--dock-icon-size) + var(--dock-padding) * 2);
	}

	.dockSection {
		position: relative;
		display: flex;
		align-items: flex-end;
		padding-block: var(--dock-padding);
		background-color: #ffffff66;
		border: 1px solid #ffffff26;

		@media (prefers-reduced-transparency: reduce) {
			background-color: hsl(from var(--desktop-color) h s calc(l * 1.33));
		}

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
