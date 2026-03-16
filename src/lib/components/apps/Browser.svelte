<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();
	const { appName, app, getFocused } = getAppContext();

	let focused = $derived(getFocused());
</script>

<div class="browser">
	<iframe src={app.url} title={app.title}></iframe>
	<div
		class={[
			'browserCover',
			{
				solid: windowServer.draggingEl || windowServer.resizingEl || !focused,
				visible: !focused
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
