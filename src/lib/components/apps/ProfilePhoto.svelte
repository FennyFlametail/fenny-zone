<script lang="ts">
	const {
		photo,
		alt
	}: {
		/** Photos should be 725x1024 */
		photo: string;
		alt: string;
	} = $props();
</script>

<img class="profilePhoto" src={photo} {alt} width={725} height={1024} draggable="false" />

<style>
	.profilePhoto {
		width: auto;
		height: calc(100cqh - 2px);
		object-fit: contain;
		object-position: bottom right;
		-webkit-user-select: none;
		user-select: none;
		pointer-events: none;
	}

	@container window (width < 1000px) {
		.profilePhoto {
			height: 100%;
		}
	}
</style>
