<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import WarningDialog from '$lib/components/WarningDialog.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';

	const {
		crashedAppName
	}: {
		crashedAppName: AppName;
	} = $props();

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext();

	if (!crashedAppName) {
		// failsafe because reloading doesn't preserve props
		// TODO serialize props in localStorage?
		setTimeout(() => windowServer.closeApp(appName), 0);
	}

	const crashedAppTitle = $derived(windowServer.apps[crashedAppName]?.title);
</script>

<WarningDialog
	title={`The application ${crashedAppTitle} quit unexpectedly.`}
	body={`fenny.zone and other applications are not affected.
	
	Click Reopen to open the application again. DM me on Bluesky if this keeps happening I guess`}
>
	{#snippet buttonsLeft()}
		<button class="aqua-button" onclick={() => windowServer.closeApp(appName)}>Close</button>
	{/snippet}
	{#snippet buttonsRight()}
		<button class="aqua-button primary" onclick={() => windowServer.openApp(crashedAppName)}
			>Reopen</button
		>
	{/snippet}
</WarningDialog>
