<script lang="ts">
	const {
		src,
		alt
	}: {
		src: string;
		alt: string;
	} = $props();
</script>

<div class="preview">
	<img {src} {alt} draggable="false" />
</div>

<style>
	.preview {
		overflow: hidden;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
