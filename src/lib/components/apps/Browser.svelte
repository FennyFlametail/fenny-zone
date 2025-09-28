<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context';

	const windowServer = getWindowServerContext();
	const { appName, app } = getAppContext();

	let isFocused = $derived(app === windowServer.focusedApp.app);
</script>

<iframe src={app.url} title={app.title}></iframe>
<div
	class={[
		'cover',
		{
			solid: windowServer.dragging.el || windowServer.resizing.el || !isFocused,
			visible: !isFocused
		}
	]}
	onclick={() => windowServer.focusApp(appName)}
	aria-hidden="true"
></div>

<style>
	iframe {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	.cover {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
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
