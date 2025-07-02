<script lang="ts">
	import { type Component } from 'svelte';
	import type AppMetadata from '$lib/types/AppMetadata';
	import * as apps from '$lib/apps';

	const {
		openApp,
		resetApps
	}: {
		openApp: (args: { default: Component } & AppMetadata) => void;
		resetApps: () => void;
	} = $props();
</script>

<footer class="dock">
	<button class="ui" onclick={() => openApp(apps.App1)}>Open App1</button>
	<button class="ui" onclick={() => openApp(apps.App2)}>Open App2</button>
	<button class="ui primary" onclick={resetApps}>Reset App Positions</button>
</footer>
