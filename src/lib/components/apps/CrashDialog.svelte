<script lang="ts">
	import type { AppProps } from '$lib/apps.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import WarningTriangle from '$lib/images/icons/warning.webp';

	const { crashedAppName }: AppProps<'crashDialog'> = $props();

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext('crashDialog');

	const crashedAppTitle = $derived(windowServer.apps[crashedAppName]?.title);

	function handleClick(reopenApp: boolean) {
		if (reopenApp) windowServer.openApp(crashedAppName);
		windowServer.closeApp(appName);
	}
</script>

<Prompt
	icon={WarningTriangle}
	padding={true}
	title="The application {crashedAppTitle} quit unexpectedly."
	body={`fenny.zone and other applications are not affected.
	
	Click Reopen to open the application again. DM me on Bluesky if this keeps happening I guess`}
>
	{#snippet buttonsLeft()}
		<button class="aqua-button" onclick={() => handleClick(false)}>Close</button>
	{/snippet}
	{#snippet buttonsRight()}
		<button class="aqua-button primary" onclick={() => handleClick(true)}>Reopen</button>
	{/snippet}
</Prompt>
