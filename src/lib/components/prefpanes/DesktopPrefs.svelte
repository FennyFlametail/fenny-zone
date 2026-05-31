<script lang="ts">
	import { getWindowServerContext } from '$lib/context.svelte';
	import { desktopPictures } from '$lib/data/desktopPictures';
	import { getDesktopPicture } from '$lib/helpers/getDesktopPicture.svelte';
	import { FastAverageColor } from 'fast-average-color';
	import { Ban } from 'lucide-svelte';

	const windowServer = getWindowServerContext();
	let currentPic = $state(await getDesktopPicture(windowServer));

	let well = $state<HTMLLabelElement>();
	let fileInput = $state<HTMLInputElement>();
	let dragType = $state<null | 'valid' | 'invalid'>(null);

	function isValidFile(item: { type: string }) {
		return item.type.startsWith('image/') || item.type.startsWith('video/');
	}

	function onWindowDragOver(e: DragEvent) {
		const fileItems = [...e.dataTransfer!.items].filter((item) => item.kind === 'file');
		if (fileItems.length > 0) {
			e.preventDefault();
			if (!well!.contains(e.target as Node)) {
				e.dataTransfer!.dropEffect = 'none';
			}
		}
	}

	function onWindowDrop(e: DragEvent) {
		if ([...e.dataTransfer!.items].some((item) => item.kind === 'file')) {
			e.preventDefault();
		}
	}

	function ondragover(e: DragEvent) {
		const fileItems = [...e.dataTransfer!.items].filter((item) => item.kind === 'file');
		if (fileItems.length > 0) {
			e.preventDefault();
			if (fileItems.some(isValidFile)) {
				e.dataTransfer!.dropEffect = 'copy';
				dragType = 'valid';
			} else {
				e.dataTransfer!.dropEffect = 'none';
				dragType = 'invalid';
			}
		}
	}

	function ondragleave(e: DragEvent) {
		if (e.target === well || e.target === fileInput) {
			dragType = null;
		}
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		processFile(e.dataTransfer?.files[0]);
	}

	function onFileSelect(e: Event) {
		processFile((e.currentTarget as HTMLInputElement).files?.[0]);
	}

	async function processFile(file?: File) {
		if (!file || !isValidFile(file)) return;

		const root = await navigator.storage.getDirectory();
		try {
			await root.removeEntry('wallpaper', { recursive: true });
		} catch {}
		const folder = await root.getDirectoryHandle('wallpaper', { create: true });
		const handle = await folder.getFileHandle(file.name, { create: true });
		const stream = await handle.createWritable();
		await stream.write(file);
		await stream.close();

		setDesktopPicture('_custom');
		dragType = null;
	}

	async function setDesktopPicture(name: keyof typeof desktopPictures, e?: MouseEvent) {
		if ((windowServer.preferences.desktopPicture = '_custom')) {
			URL.revokeObjectURL(currentPic.src);
		}

		// force the desktop to refresh
		windowServer.preferences.desktopPicture = null;
		windowServer.preferences.desktopPicture = name;
		currentPic = await getDesktopPicture(windowServer);
	}

	let fac = new FastAverageColor();
	$effect(() => () => fac.destroy());

	function onPreviewLoad(e: Event) {
		const preview = e.currentTarget as HTMLImageElement | HTMLVideoElement;
		const desktopColor = fac.getColor(preview, {
			width: preview instanceof HTMLVideoElement ? preview.videoWidth : preview.naturalWidth,
			height: preview instanceof HTMLVideoElement ? preview.videoHeight : preview.naturalHeight
		}).hex;
		localStorage.setItem('desktopColor', desktopColor);
		document.documentElement.style.setProperty('--desktop-color', desktopColor);
	}
</script>

<div class="desktopPrefs">
	<label
		bind:this={well}
		class="desktopPrefsWell"
		data-drag-type={dragType}
		aria-label="Click to choose an image"
		{ondragover}
		{ondragleave}
		{ondrop}
	>
		{#if currentPic.isVideo}
			<video
				class="desktopPrefsImagePreview"
				src={currentPic.src}
				autoplay
				loop
				muted
				oncanplay={onPreviewLoad}
			></video>
		{:else}
			<img
				class="desktopPrefsImagePreview"
				src={currentPic.src}
				alt={currentPic.alt}
				draggable="false"
				onload={onPreviewLoad}
			/>
		{/if}
		<input
			bind:this={fileInput}
			class="desktopPrefsImageInput"
			type="file"
			accept="image/*,video/*"
			onchange={onFileSelect}
			tabindex="0"
		/>
		<Ban class="desktopPrefsBanIcon" size={64} strokeWidth={3} aria-hidden="true" />
	</label>
	<div class="desktopPrefsHintText">
		<div>Drag an image or video file into the well, or choose one below.</div>
		<small>(Files will not leave your device.)</small>
	</div>
	<div class="desktopPrefsDetails">
		<div class="desktopPrefsTitle">{currentPic.title}</div>
		{#if currentPic.artist}
			<span class="desktopPrefsArtist"
				>by
				{#if currentPic.link}
					<a href={currentPic.link} target="_blank">{currentPic.artist}</a>
				{:else}
					<span>{currentPic.artist}</span>
				{/if}
			</span>
		{/if}
	</div>
	<div class="desktopPrefsGallery" role="region" aria-label="Available images">
		{#each Object.keys(desktopPictures) as (keyof typeof desktopPictures)[] as name}
			{@const pic = desktopPictures[name]}
			{#if pic.thumb}
				<button class="desktopPrefsThumb" onclick={(e) => setDesktopPicture(name, e)}>
					<img src={pic.thumb} alt={pic.alt} draggable="false" />
				</button>
			{/if}
		{/each}
	</div>
</div>
<svelte:window ondragover={onWindowDragOver} ondrop={onWindowDrop} />

<style>
	.desktopPrefs {
		--row-gap: 17px;
		display: grid;
		grid-template:
			'well details' auto
			'hint hint' auto
			'thumbs thumbs' 1fr
			/ auto 1fr;
		padding: 20px;
		row-gap: var(--row-gap);
		column-gap: 20px;
		overflow: hidden;
		-webkit-user-select: none;
		user-select: none;
	}

	.desktopPrefsWell {
		--box-shadow: inset 0 2px 5px 0 #767676;
		grid-area: well;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 210px;
		height: 117px;
		padding: 7px;
		border: 2px solid white;
		border-radius: 7px;
		background-color: #f3f3f3;
		box-shadow: var(--box-shadow);

		&[data-drag-type='valid'] {
			background-color: #d9d9d9;
		}

		&[data-drag-type='invalid'] {
			:global(.desktopPrefsBanIcon) {
				opacity: 0.75;
			}

			.desktopPrefsImageInput {
				cursor: not-allowed;
			}

			.desktopPrefsImagePreview {
				filter: brightness(0.75);
			}
		}

		&:has(.desktopPrefsImageInput:focus-visible) {
			outline: none;
			box-shadow: var(--box-shadow), var(--focus-box-shadow);
		}
	}

	:global(.desktopPrefsBanIcon) {
		position: absolute;
		color: white;
		opacity: 0;
		transition: opacity 250ms;
		pointer-events: none;
	}

	.desktopPrefsImagePreview {
		width: 100%;
		height: 100%;
		object-fit: cover;
		will-change: filter;
		transition: filter 250ms;
	}

	.desktopPrefsImageInput {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.desktopPrefsDetails {
		min-width: 0;
		grid-area: details;
		padding-top: 20px;
	}

	.desktopPrefsTitle {
		overflow-wrap: break-word;
	}

	.desktopPrefsArtist {
		color: var(--text-secondary);
		font-size: 14px;
	}

	.desktopPrefsHintText {
		grid-area: hint;
		margin-block: calc(var(--row-gap) / 2 * -1);
		color: var(--text-secondary);
		font-size: 14px;

		small {
			font-size: 12px;
		}
	}

	.desktopPrefsGallery {
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
		overscroll-behavior: none;

		:global(.systemPreferences.transition) & {
			overflow-y: hidden;
		}
	}

	.desktopPrefsThumb {
		background: none;
		border: none;
		padding: 0;

		&:focus-visible {
			outline: none;
			box-shadow: var(--focus-box-shadow);
		}
	}
</style>
