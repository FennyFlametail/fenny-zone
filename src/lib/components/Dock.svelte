<script lang="ts">
	import apps from '$lib/apps.svelte';
	import DockIcon from '$lib/components/DockIcon.svelte';
	import type { AppName } from '$lib/types/AppTypes';
</script>

<footer class="dock">
	{#each Object.entries(apps) as [appName, app]}
		<DockIcon appName={appName as AppName} {app} />
	{/each}
</footer>

<style>
	/* TODO shrink if wider than window */
	.dock {
		--padding: 7.5px;
		--icon-size: 64px;
		z-index: 10000;
		position: fixed;
		bottom: 0;
		left: 50%;
		translate: -50%;
		display: flex;
		align-items: flex-end;
		height: calc(var(--icon-size) + var(--padding) * 2);
		padding: var(--padding) calc(var(--padding) / 2);
		background-color: #ffffff66;
		border: 1px solid #ffffff26;
		box-shadow: 0 0 0 1px #00000026;
	}
</style>
