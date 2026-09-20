<script lang="ts">
	import { browser } from '$app/environment';
	import WindowSidebar from '$lib/components/WindowSidebar.svelte';
	import WindowSidebarItem from '$lib/components/WindowSidebarItem.svelte';
	import WindowStatusBar from '$lib/components/WindowStatusBar.svelte';
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import itunesBrowseIcon from '$lib/images/icons/itunes-browse.png';
	import itunesLibraryIcon from '$lib/images/icons/itunes-library.png';
	import { fromUnixTime, intlFormat } from 'date-fns';
	import { decode } from 'html-entities';
	import {
		ArrowBigRight,
		FastForward,
		PanelLeftClose,
		PanelLeftOpen,
		Play,
		Rewind,
		Volume1,
		Volume2
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { getLastFmFeed, type LastFmProfile, type MusicTrack } from './lastfm.remote';

	const windowServer = getWindowServerContext();
	const { appName } = getAppContext<'music'>();

	let profile = $state<LastFmProfile | null>(browser ? null : await getLastFmFeed());

	onMount(async () => {
		if (!profile) {
			try {
				profile = await getLastFmFeed();
			} catch (e) {
				windowServer.closeAppWithError(appName, e);
			}
		}
	});

	const recentsGrouped = $derived.by(() => {
		if (!profile?.recents) return [];

		const grouped: MusicTrack[][] = [];
		let lastAlbum = '';

		profile.recents.forEach((track) => {
			if (lastAlbum === track.album) {
				grouped.at(-1)?.unshift(track);
			} else {
				grouped.push([track]);
			}
			lastAlbum = track.album;
		});
		return grouped;
	});
	$inspect(recentsGrouped);

	let loading = $state(true);
	setTimeout(() => (loading = false), 500);

	let showSidebar = $state(true);
	let currentWidth = $state(NaN);
	let lastWidth = $state(NaN);

	const SIDEBAR_BREAKPOINT = 600;

	$effect(() => {
		if (currentWidth >= SIDEBAR_BREAKPOINT && lastWidth < SIDEBAR_BREAKPOINT) {
			showSidebar = true;
		} else if (currentWidth < SIDEBAR_BREAKPOINT && lastWidth >= SIDEBAR_BREAKPOINT) {
			showSidebar = false;
		}
		lastWidth = currentWidth;
	});
</script>

<div
	class={['itunes', 'brushedNoInset', { loading }]}
	bind:clientWidth={currentWidth}
	data-allow-window-drag
>
	<!-- #region Toolbar -->
	<WindowToolbar>
		<div class="itunesControls" data-allow-window-drag aria-hidden="true">
			<div class="itunesPlayButtons">
				<div class="aqua-button circle disabled">
					<Rewind size={28} />
				</div>
				<div class="aqua-button circle large disabled">
					<Play size={44} />
				</div>
				<div class="aqua-button circle disabled">
					<FastForward size={28} />
				</div>
			</div>
			<div class="itunesVolumeSlider">
				<Volume1 size={20} />
				<input type="range" tabindex="-1" />
				<Volume2 size={20} />
			</div>
		</div>
		<div class="itunesStatusWindow" data-allow-window-drag aria-hidden="true"></div>
		<a
			class="itunesProfileButton aqua-button-with-label noJS-pointer"
			href={profile?.url}
			target="_blank"
			aria-label="Open profile on Last.fm"
		>
			<div class={['aqua-button', 'circle', 'large', { disabled: !profile?.url }]}>
				<img class="itunesBrowseIcon" src={itunesBrowseIcon} alt="" draggable="false" />
			</div>
			<span>Last.fm</span>
		</a>
	</WindowToolbar>

	<WindowSidebar type="iTunes" class="brushedInset" header="Source">
		<WindowSidebarItem selected aria-label="Recently Played">
			<button class="itunesSidebarItem">
				<img src={itunesLibraryIcon} alt="" draggable="false" />
				<span>Recently Played</span>
			</button>
		</WindowSidebarItem>
	</WindowSidebar>

	<!-- #region Table -->
	<section class="itunesSongTableWrapper brushedInset">
		<div role="table" class="itunesSongTable aqua-table rows-reversed" aria-label="Recently Played">
			<div role="rowgroup" class="aqua-table-header" aria-label="Table header">
				<div role="row">
					<div
						role="columnheader"
						class="itunesHeaderAlbumDetails"
						aria-label="Album details"
					></div>
					<div role="columnheader" class="itunesHeaderName">Name</div>
					<div role="columnheader" class="itunesHeaderLoved">My Rating</div>
					<div role="columnheader" class="itunesHeaderLastPlayed">Last Played</div>
				</div>
			</div>
			{#each recentsGrouped as album}
				{@const albumName = decode(album[0].album)}
				{@const artistName = decode(album[0].artist)}
				<div
					role="rowgroup"
					class="itunesAlbum aqua-table-body"
					style:--track-count={album.length}
					aria-label="{albumName} - {artistName}"
				>
					<div role="row" class="itunesAlbumDetails" aria-label="Album details">
						<img
							class="itunesAlbumArt"
							src={album[0].image}
							alt=""
							loading="lazy"
							draggable="false"
						/>
						<img
							class="itunesAlbumArtReflection"
							src={album[0].image}
							alt=""
							loading="lazy"
							draggable="false"
						/>
						<a
							role="rowheader"
							class="itunesAlbumName"
							href={album[0].albumLink}
							target="_blank"
							title={albumName}
							aria-label="Album - {albumName} - Open on Last.fm">{albumName}</a
						>
						<a
							role="rowheader"
							class="itunesAlbumArtist"
							href={album[0].artistLink}
							target="_blank"
							aria-label="Artist - {artistName} - Open on Last.fm">{artistName}</a
						>
					</div>
					{#each album as track}
						{@const trackName = decode(track.name)}
						{@const lastPlayed = intlFormat(fromUnixTime(track.lastPlayed), { dateStyle: 'short' })}
						<div role="row" class="itunesTrackRow" aria-label={trackName}>
							<div role="cell" class="itunesTrackNameCell" aria-label={trackName}>
								<span class="itunesTrackName" title={trackName}>{trackName}</span>
								<a
									class="itunesSongLink noJS-pointer"
									href={track.link}
									title="Open on Last.fm"
									aria-label="Open on Last.fm"
									target="_blank"
								>
									<ArrowBigRight size={12} fill="currentColor" />
								</a>
							</div>
							<div
								role="cell"
								class="itunesTrackLoved"
								aria-label={track.loved ? 'Loved' : 'Not Loved'}
							>
								{track.loved ? '★★★★★' : ''}
							</div>
							<div role="cell" class="itunesTrackLastPlayed" aria-label="Last played: {lastPlayed}">
								{lastPlayed}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</section>

	<!-- #region Footer -->
	<WindowStatusBar>
		<label class="aqua-button metal" aria-label="Toggle sidebar">
			<input type="checkbox" id="itunesSidebarInput" checked={showSidebar} />
			<PanelLeftClose size={22} />
			<PanelLeftOpen size={22} />
		</label>
	</WindowStatusBar>
</div>

<style>
	/* #region Styles */
	.itunes {
		--status-bar-height: 45px;
		display: grid;
		grid-template:
			'toolbar toolbar' auto
			'sidebar content' 1fr / calc(var(--sidebar-width) + var(--titlebar-padding)) 1fr;
		transition: grid-template-columns 0.25s linear;
		/* necessary to hide the sidebar while still showing brushed inset borders */
		padding: 1px;
		padding-bottom: calc(var(--status-bar-height) - var(--window-brushed-bottom-padding));
		overflow: hidden;

		&.loading {
			@media not (scripting: none) {
				transition-duration: 0s;
			}
		}

		&:not(:has(#itunesSidebarInput:checked)) {
			grid-template-columns: 0 1fr;
		}
		@media (scripting: none) {
			@container window (width < 600) {
				grid-template-columns: 0 1fr;
			}
		}
	}

	/* #region Toolbar */
	.itunes :global(.windowToolbar) {
		display: grid;
		grid-template: 'controls status browse' 1fr / var(--sidebar-width) 1fr var(--sidebar-width);
		gap: 21px;
		align-items: start;
	}

	.itunesControls {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.itunesPlayButtons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: inherit;

		.aqua-button :global(.lucide-icon) {
			scale: 1 0.7;
			fill: currentColor;
			stroke: none;

			&:global(.lucide-rewind) {
				margin-right: 2px;
			}
			&:global(.lucide-play) {
				scale: 0.8 0.65;
				translate: 1px;
			}
			&:global(.lucide-fast-forward) {
				margin-left: 2px;
			}
		}
	}

	.itunesVolumeSlider {
		display: flex;
		align-items: center;

		> :global(svg) {
			flex-shrink: 0;
			color: #484848;
			filter: drop-shadow(0 1px 0 #e3e3e3);

			> :global(path:first-child) {
				fill: currentColor;
			}

			&:last-child {
				margin-left: 3px;
			}
		}

		> input {
			--thumb-inner-color: #616161;
			appearance: none;
			margin-block: 4px;
			width: calc(var(--sidebar-width) - 40px - 3px);
			height: 8px;
			border-radius: 9999px;
			background: linear-gradient(to bottom, #606060, #e5e5e5);

			&::-webkit-slider-thumb {
				appearance: none;
				width: 16px;
				height: 16px;
				border-radius: 9999px;
				border: 1px solid #606060;
				background:
					radial-gradient(var(--thumb-inner-color) 3px, transparent 3px),
					linear-gradient(to bottom, white, #8a8a8a);
			}
			&::-moz-range-thumb {
				appearance: none;
				width: 16px;
				height: 16px;
				border-radius: 9999px;
				border: 1px solid #606060;
				background:
					radial-gradient(var(--thumb-inner-color) 3px, transparent 3px),
					linear-gradient(to bottom, white, #8a8a8a);
			}

			&:active::-webkit-slider-thumb {
				--thumb-inner-color: #0e73d7;
			}
			&:active::-moz-range-thumb {
				--thumb-inner-color: #0e73d7;
			}
		}
	}

	.itunesStatusWindow {
		height: 60px;
		justify-self: stretch;
		display: grid;
		place-items: center;
		border-radius: 9999px;
		border: 1px solid transparent;
		background:
			linear-gradient(to bottom, #d6dbbf, #d6dbbf) content-box,
			linear-gradient(to bottom, #737667, #f7f8f2) border-box;
		box-shadow: inset 0 3px 5px -3px black;
		font-size: 42px;

		&::before,
		&::after {
			grid-area: 1 / -1 / 1 / -1;
			content: '🦊';
			background-color: #35362f;
			background-clip: text;
			color: transparent;
		}

		&::before {
			background-color: #737667;
			scale: 0.9;
			translate: 0 3px;
			filter: blur(3px);
		}

		&::after {
			z-index: 1;
		}
	}

	.itunesProfileButton {
		justify-self: end;
	}

	.itunesBrowseIcon {
		width: 31px;
		height: 20px;
	}

	/* #region Sidebar */

	.itunes :global(.windowSidebar) {
		justify-self: end;
		margin-right: var(--titlebar-padding);
	}

	.itunesSidebarItem {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 1px 5px;
		background: none;
		border: none;
		font-size: var(--table-font-size);
		color: inherit;

		img {
			width: 21px;
			height: 21px;
			image-rendering: pixelated;
		}
	}

	/* #region Table */
	.itunesSongTableWrapper {
		grid-area: content;
		container: table / inline-size;
		min-width: 0;
		min-height: 0;
		overflow: auto;
		background-color: white;
	}

	.itunesSongTable {
		--album-art-width: 142px;
		--itunes-content-spacing: 15px;
		--itunes-width-loved: 100px;
		--itunes-width-last-played: 105px;
		--table-columns: calc(var(--album-art-width) + var(--itunes-content-spacing) * 2) auto
			var(--itunes-width-loved) var(--itunes-width-last-played);
		--row-height: 21px;
	}

	@container table (width < 700px) {
		.itunesSongTable {
			--itunes-width-last-played: 0;
		}

		.itunesHeaderLastPlayed,
		.itunesTrackLastPlayed {
			display: none;
		}
	}

	@container table (width < 600px) {
		.itunesSongTable {
			--itunes-width-loved: 0;
		}

		.itunesHeaderLoved,
		.itunesTrackLoved {
			display: none;
		}
	}

	/* #region Albums */
	.itunesAlbum {
		padding-block-start: var(--itunes-content-spacing);

		&:not(:nth-child(1 of .itunesAlbum)) {
			margin-block-start: var(--itunes-content-spacing);
			border-image-source: linear-gradient(to top, #7f7f7f, #7f7f7f);
			border-image-slice: 1 0 0 0;
			border-image-width: 1px 5px 0 5px;
		}

		&:nth-last-child(1 of .itunesAlbum) {
			padding-block-end: var(--itunes-content-spacing);
		}
	}

	.itunesAlbumDetails {
		grid-column: 1 / 2;
		grid-row: 1 / span calc(var(--track-count) + 1);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-inline: var(--itunes-content-spacing);
		background: white;
		-webkit-user-select: none;
		user-select: none;
	}

	.itunesAlbumArt,
	.itunesAlbumArtReflection {
		width: var(--album-art-width);
		aspect-ratio: 1 / 1;
		border: 1px solid #545454;
	}

	.itunesAlbumArtReflection {
		--height: 50px;
		rotate: x 180deg;
		aspect-ratio: auto;
		height: var(--height);
		margin-bottom: calc(var(--height) * -1 + 10px);
		border-block-width: 0;
		object-fit: cover;
		object-position: center bottom;
		mask-image: linear-gradient(to bottom, transparent, rgb(255 255 255 / 50%));
		pointer-events: none;
	}

	.itunesAlbumName,
	.itunesAlbumArtist {
		line-height: 1.4;
		font-weight: bold;
		color: black;
		white-space: pre-line;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.itunesAlbumName {
		margin-bottom: 2.5px;
	}

	/* #region Tracks */
	.itunesTrackRow {
		grid-column: 2 / -1;
		-webkit-user-select: none;
		user-select: none;
	}

	.itunesTrackNameCell,
	.itunesTrackLoved,
	.itunesTrackLastPlayed {
		padding: 0 calc(var(--itunes-content-spacing) / 2);
	}

	.itunesTrackNameCell {
		min-width: 0;
		padding-inline-start: var(--itunes-content-spacing);
		gap: 0.5em;

		> span {
			flex-grow: 1;
		}
	}

	.itunesTrackName,
	.itunesTrackLoved,
	.itunesTrackLastPlayed {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.itunesSongLink {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		display: grid;
		place-content: center;
		border-radius: 50%;
		background-color: #a6a6a6;
		color: white;

		:global(.tableRow.selected) & {
			background-color: #e2ecfa;
			color: var(--table-selected-row-color);

			:global(.window.inactive) & {
				background-color: #7d7d7d;
				color: var(--table-selected-row-color-inactive);
			}
		}

		&:active {
			filter: brightness(75%) contrast(2);
		}
	}

	.itunesTrackLoved {
		justify-content: center;
		color: #808080;
	}

	.itunesTrackLastPlayed {
		padding-inline-end: 0;
	}

	/* #region Footer */

	.itunes :global(.windowStatusBar) {
		top: calc(100% - (var(--status-bar-height) - var(--window-brushed-bottom-padding)));
		height: var(--status-bar-height);
		display: flex;
		align-items: center;
		padding-inline-start: 7px;
	}

	#itunesSidebarInput {
		width: 0;
		height: 0;
		opacity: 0;

		&:checked ~ :global(.lucide-panel-left-open),
		&:not(:checked) ~ :global(.lucide-panel-left-close) {
			display: none;
		}
	}
</style>
