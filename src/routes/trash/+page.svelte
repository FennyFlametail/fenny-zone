<script lang="ts">
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import TrashFullIcon from '$lib/images/icons/trash-full.webp';
	import TrashPoster from '$lib/images/trash-poster.webp';
	import TrashVideo from '$lib/images/trash.mp4';

	const { app, appName } = getAppContext();
	const windowServer = getWindowServerContext();

	function onended() {
		setTimeout(() => {
			app.dockIconOverride = TrashFullIcon;
			windowServer.closeApp(appName);
		}, 100);
	}
</script>

<div class="trashContainer">
	<video
		src={TrashVideo}
		poster={TrashPoster}
		muted
		autoplay={!windowServer.reduceMotion}
		controls={windowServer.reduceMotion}
		{onended}
		playsinline
		disablepictureinpicture>Baby fox jumping into a trash can</video
	>
</div>

<style>
	.trashContainer {
		width: 100%;
		height: 100%;
		background-color: black;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
