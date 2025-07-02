<script module>
	export const name = 'Browser';
</script>

<script lang="ts">
	let { src, title }: { src: string; title: string } = $props();
	export const _windowTitle = title;
</script>

<iframe {src} {title}></iframe>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
