<script lang="ts">
	const {
		// eslint-disable-next-line svelte/valid-compile
		...props
	}: {
		[name: string]: any;
	} = $props();
</script>

<div class="blueskyPlayIcon" {...props}>▶</div>

<style>
	.blueskyPlayIcon {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 72px;
		height: 72px;
		display: grid;
		place-items: center;
		padding-left: 7.5px;
		background-color: rgb(255 255 255 / 75%);
		border-radius: 50%;
		font-size: 42px;
		color: rgb(0 0 0 / 75%);
	}
</style>
