<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import CrashReporterIcon from '$lib/images/icons/CrashReporter.webp';

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext();
</script>

<div class="dialog">
	<img class="dialogIcon" src={CrashReporterIcon} alt="Warning icon" draggable="false" />
	<h2 class="dialogTitle">Ad blocker not detected.</h2>
	<p class="dialogBody">
		Consider installing a browser extension that blocks ads and other malicious scripts in your
		browser to protect your privacy and security.
	</p>
	<div class="dialogButtons">
		<button class="aqua-button" onclick={() => windowServer.closeApp(appName)}>Close</button>
		<div class="dialogSpacer"></div>
		<a
			class="aqua-button primary"
			href="https://stefanbohacek.com/project/detect-missing-adblocker-wordpress-plugin/#resources"
			target="_blank"
			onclick={() => windowServer.closeApp(appName)}>Learn More</a
		>
	</div>
</div>

<style>
	.dialog {
		display: grid;
		grid-template:
			'icon header' auto
			'icon body' auto
			'icon buttons' auto / auto 1fr;
		padding: 22.5px 25px;
		column-gap: 25px;
		line-height: 1.25;
		-webkit-user-select: none;
		user-select: none;
	}

	.dialogIcon {
		grid-area: icon;
		height: 88px;
		width: 88px;
	}

	.dialogTitle {
		font-size: 17px;
	}

	.dialogBody {
		font-size: 15px;
	}

	.dialogButtons {
		display: flex;
		align-items: flex-end;
		gap: 18px;
	}

	.dialogSpacer {
		flex-grow: 1;
	}
</style>
