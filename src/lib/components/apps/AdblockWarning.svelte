<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import WarningDialog from '$lib/components/WarningDialog.svelte';

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext();
</script>

<WarningDialog
	title="Ad blocker not detected."
	body="Consider installing a browser extension that blocks ads and other malicious scripts to protect your privacy and security."
>
	{#snippet buttonsLeft()}
		<button class="aqua-button" onclick={() => windowServer.closeApp(appName)}>Close</button>
	{/snippet}
	{#snippet buttonsRight()}
		<a
			class="aqua-button primary"
			href="https://stefanbohacek.com/project/detect-missing-adblocker-wordpress-plugin/#resources"
			target="_blank"
			onclick={() => windowServer.closeApp(appName)}>Learn More</a
		>
	{/snippet}
</WarningDialog>
