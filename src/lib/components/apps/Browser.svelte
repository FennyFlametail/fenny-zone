<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';

	const {
		url
	}: {
		url: string;
	} = $props();

	const windowServer = getWindowServerContext();
	const { appName, app } = getAppContext<AppName>();
	app.instance.menuItems = { File: menuItems };
</script>

{#snippet menuItems()}
	<MenuItem href={url} newTab>Open in New Tab</MenuItem>
{/snippet}

<div class="browser">
	<iframe src={url} title={app.title}></iframe>
	<div
		class={[
			'browserCover',
			{
				solid: windowServer.draggingEl || windowServer.resizingEl || !app.instance.focused,
				visible: !app.instance.focused
			}
		]}
		onclick={() => windowServer.focusApp(appName)}
		aria-hidden="true"
	></div>
</div>

<style>
	.browser {
		background-color: white;
	}

	iframe,
	.browserCover {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	iframe {
		border: none;
	}

	.browserCover {
		transition: background-color 0.2s;
		pointer-events: none;

		&.solid {
			pointer-events: auto;
		}

		&.visible {
			background-color: rgb(0 0 0 / 50%);
		}
	}
</style>
