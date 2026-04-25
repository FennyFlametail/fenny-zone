<script lang="ts">
	import Prompt from '$lib/components/Prompt.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import WarningTriangle from '$lib/images/icons/warning.webp';

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext();
</script>

<Prompt
	icon={WarningTriangle}
	padding={true}
	title="Ad blocker not detected."
	body="Consider installing a browser extension that blocks ads and other malicious scripts to protect your privacy and security."
	role="status"
>
	{#snippet buttonsLeft()}
		<button class="aqua-button" onclick={() => windowServer.closeApp(appName)}>Close</button>
	{/snippet}
	{#snippet buttonsRight()}
		<a
			class="aqua-button primary"
			role="button"
			href="https://stefanbohacek.com/project/detect-missing-adblocker-wordpress-plugin/#resources"
			target="_blank"
			onclick={() => windowServer.closeApp(appName)}>Learn More</a
		>
	{/snippet}
</Prompt>
