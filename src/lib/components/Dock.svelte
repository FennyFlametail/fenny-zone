<script lang="ts">
	import * as apps from '$lib/apps';
	import { openApp, resetApps } from '$lib/windowServer.svelte';
</script>

<footer class="dock">
	<button class="ui" onclick={() => openApp(apps.App1)}>Open App1</button>
	<button class="ui" onclick={() => openApp(apps.App2)}>Open App2</button>
	<button
		class="ui"
		onclick={() =>
			openApp(apps.Browser, {
				src: 'https://toddspin.fenny.zone',
				title: 'Toddspin'
			})}>Open Browser</button
	>
	<button class="ui primary" onclick={resetApps}>Reset App Positions</button>
</footer>

<style>
	.dock {
		flex-shrink: 0;
		z-index: 10000;
	}
</style>
