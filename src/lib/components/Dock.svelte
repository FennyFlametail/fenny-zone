<script lang="ts">
	import apps from '$lib/apps';
	import DockIcon from '$lib/components/DockIcon.svelte';
</script>

<footer class="dock">
	{#each apps as app}
		<DockIcon {app} />
	{/each}
</footer>

<style>
	/* TODO shrink if wider than window */
	.dock {
		--padding: 7.5px;
		--icon-size: 64px;
		z-index: 10000;
		position: absolute;
		bottom: 0;
		align-self: center;
		display: flex;
		align-items: flex-end;
		height: calc(var(--icon-size) + var(--padding) * 2);
		padding: var(--padding) calc(var(--padding) / 2);
		background-color: #ffffff66;
		border: 1px solid #ffffff26;
		box-shadow: 0 0 0 1px #00000026;
	}
</style>
