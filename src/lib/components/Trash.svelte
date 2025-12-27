<script lang="ts">
	import { browser } from '$app/environment';
	import TrashPoster from '$lib/images/trash-poster.webp';
	import TrashVideo from '$lib/images/trash.mp4';

	let reduceMotion = true;

	if (browser) {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
	}
</script>

<div class="trashContainer">
	<video
		src={TrashVideo}
		poster={TrashPoster}
		muted
		autoplay={!reduceMotion}
		controls={reduceMotion}
		loop
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
