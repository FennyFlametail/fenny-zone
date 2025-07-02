<script module>
	export const name = 'Browser';
</script>

<script lang="ts">
	const { src, title }: { src: string; title: string } = $props();

	function onload(e: Event) {
		const target = e.target as HTMLIFrameElement;
		console.debug(target.contentDocument?.title);
		// TODO override window title with site title
	}
</script>

<iframe {onload} {src} {title}></iframe>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
