<script lang="ts">
	import { browser } from '$app/environment';

	let reduceMotion = true;

	if (browser) {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
	}
</script>

<div class="trashContainer">
	<video
		src="/trash.mp4"
		poster="/trash-poster.webp"
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
