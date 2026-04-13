<script lang="ts">
	import { getWindowServerContext } from '$lib/context.svelte';
	import { desktopPictures, type DesktopPicture } from '$lib/data/desktopPictures';

	const windowServer = getWindowServerContext();
	const pic: DesktopPicture = $derived(desktopPictures[windowServer.preferences.desktopPicture]);

	function setDesktopPicture(name: keyof typeof desktopPictures) {
		const picture = desktopPictures[name];
		windowServer.preferences.desktopPicture = name;
		localStorage.setItem('desktopColor', picture.fallbackColor);
	}
</script>

<div class="desktopPrefs">
	<img class="desktopPrefsWell" src={pic.src} alt={pic.alt} draggable="false" />
	<div class="desktopPrefsDetails">
		<div class="desktopPrefsTitle">{pic.title}</div>
		<span class="desktopPrefsArtist"
			>by
			{#if pic.link}
				<a href={pic.link} target="_blank">{pic.artist}</a>
			{:else}
				<span>{pic.artist}</span>
			{/if}
		</span>
	</div>
	<div class="desktopPrefsThumbs">
		{#each Object.keys(desktopPictures) as (keyof typeof desktopPictures)[] as name}
			{@const pic = desktopPictures[name]}
			<button class="desktopPrefsThumb" onclick={() => setDesktopPicture(name)}>
				<img src={pic.thumb} alt={pic.alt} draggable="false" />
			</button>
		{/each}
	</div>
</div>

<style>
	.desktopPrefs {
		display: grid;
		grid-template:
			'well details' auto
			'thumbs thumbs' 1fr / auto 1fr;
		padding: 20px;
		row-gap: 17px;
		column-gap: 20px;
		overflow: hidden;
	}

	.desktopPrefsWell {
		grid-area: well;
		width: 210px;
		height: 117px;
		padding: 7px;
		border: 2px solid white;
		border-radius: 7px;
		background-color: #f3f3f3;
		box-shadow: inset 0 2px 5px 0 #767676;
		object-fit: cover;
	}

	.desktopPrefsDetails {
		grid-area: details;
		padding-top: 20px;
		-webkit-user-select: none;
		user-select: none;
	}

	.desktopPrefsArtist {
		color: var(--text-secondary);
		font-size: 14px;
	}

	.desktopPrefsThumbs {
		grid-area: thumbs;
		display: grid;
		grid-template-columns: repeat(auto-fill, 100px);
		justify-content: space-evenly;
		align-content: start;
		padding-block: 6px;
		gap: 6px;
		background-color: white;
		border: 1px solid #bebebe;
		border-top-color: #8e8e8e;
		overflow-y: auto;

		:global(.systemPreferences.transition) & {
			overflow-y: hidden;
		}
	}

	.desktopPrefsThumb {
		background: none;
		border: none;
		padding: 0;
	}
</style>
