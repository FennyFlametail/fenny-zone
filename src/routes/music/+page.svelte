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

	let loading = $state(true);
	setTimeout(() => (loading = false), 500);

	let sidebarInput = $state<HTMLInputElement>();
	let currentWidth = $state(NaN);
	let lastWidth = $state(NaN);
	const sidebarBreakpoint = 600;

	$effect(() => {
		if (currentWidth >= sidebarBreakpoint && lastWidth < sidebarBreakpoint) {
			sidebarInput && (sidebarInput.checked = true);
		} else if (currentWidth < sidebarBreakpoint && lastWidth >= sidebarBreakpoint) {
			sidebarInput && (sidebarInput.checked = false);
		}
		lastWidth = currentWidth;
	});
</script>

<!-- #region Template -->
<div
	class={['itunes', 'brushedNoInset', { loading }]}
	bind:clientWidth={currentWidth}
	data-allow-window-drag
>
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
		<div class="itunesStatusWindow" data-allow-window-drag></div>
		<a
			class="itunesProfileButton aqua-button-with-label noJS-pointer"
			href={profile?.url}
			target="_blank"
			aria-labelledby="itunesProfileButtonLabel"
		>
			<div class={['aqua-button', 'circle', 'large', { disabled: !profile?.url }]}>
				<img class="itunesBrowseIcon" src={itunesBrowseIcon} alt="" draggable="false" />
			</div>
			<span id="itunesProfileButtonLabel">Last.fm</span>
		</a>
	</WindowToolbar>

	<WindowSidebar type="iTunes" class="brushedInset" header="Source">
		<WindowSidebarItem selected>
			<button class="itunesSidebarItem">
				<img src={itunesLibraryIcon} alt="" draggable="false" />
				<span>Recently Played</span>
			</button>
		</WindowSidebarItem>
	</WindowSidebar>

	<!-- #region Table -->
	<div class="itunesContent brushedInset">
		<table class="aqua-table rows-reversed">
			<thead>
				<tr>
					<th class="itunesHeaderAlbumDetails" scope="col"></th>
					<th class="itunesHeaderName" scope="col">Name</th>
					<th class="itunesHeaderLoved" scope="col">My Rating</th>
					<th class="itunesHeaderLastPlayed" scope="col">Last Played</th>
				</tr>
			</thead>
			{#each recentsGrouped as album, albumIndex}
				<tbody>
					<tr class="itunesAlbumDividerRow" aria-hidden="true">
						<td colspan="4"></td>
					</tr>
					{#each album as track, trackIndex}
						<tr class="itunesTrackRow">
							{#if trackIndex === 0}
								<th class="itunesAlbumDetailsCell" scope="rowgroup" rowspan={album.length}>
									<div class="itunesAlbumDetails">
										<img class="itunesAlbumArt" src={album[0].image} alt="" draggable="false" />
										<img
											class="itunesAlbumArtReflection"
											src={album[0].image}
											alt=""
											draggable="false"
										/>
										<a
											class="itunesAlbumName"
											href={album[0].albumLink}
											target="_blank"
											title={decode(album[0].album)}>{decode(album[0].album)}</a
										>
										<a
											class="itunesAlbumArtist"
											href={album[0].artistLink}
											target="_blank"
											title={decode(album[0].artist)}>{decode(album[0].artist)}</a
										>
									</div>
								</th>
							{/if}
							<td class="itunesTrackNameCell">
								<span class="itunesTrackName" title={decode(track.name)}>{decode(track.name)}</span>
								<a
									class="itunesSongLink noJS-pointer"
									href={track.link}
									title="View on Last.fm"
									aria-label="View on Last.fm"
									target="_blank"
								>
									<ArrowBigRight size={12} fill="currentColor" />
								</a>
							</td>
							<td class="itunesTrackLoved">{track.loved ? '★★★★★' : ''}</td>
							<td class="itunesTrackLastPlayed">
								{intlFormat(fromUnixTime(track.lastPlayed), {
									dateStyle: 'short'
								})}
							</td>
						</tr>
					{/each}
				</tbody>
			{/each}
		</table>
	</div>

	<WindowStatusBar>
		<label class="aqua-button metal" aria-label="Show Sidebar">
			<input
				type="checkbox"
				id="itunesSidebarInput"
				bind:this={sidebarInput}
				checked={!browser || currentWidth >= sidebarBreakpoint}
			/>
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

	.itunesContent {
		--itunes-content-spacing: 15px;
		grid-area: content;
		display: flex;
		flex-flow: column;
		background-color: white;
		overflow-y: scroll;
	}

	.aqua-table {
		--album-art-width: 142px;
		--row-height: 24px;
		width: 100%;
		table-layout: fixed;

		thead {
			z-index: 1;
		}
	}

	.itunesHeaderAlbumDetails {
		width: calc(var(--album-art-width) + var(--itunes-content-spacing) * 2);
	}

	.itunesHeaderLoved {
		width: 100px;
	}

	.itunesHeaderLastPlayed {
		width: 105px;
	}

	.itunesHeaderLoved,
	.itunesTrackLoved {
		@container window (width < 700px) {
			/* can't do display: none because of colspan */
			width: 0;
			padding: 0;
		}
	}

	.itunesHeaderLastPlayed,
	.itunesTrackLastPlayed {
		@container window (width < 800px) {
			width: 0;
			padding: 0;
		}
	}

	.itunesAlbumDividerRow {
		background-color: transparent;
		height: var(--itunes-content-spacing);

		tbody:not(:first-of-type) & {
			height: calc(var(--itunes-content-spacing) * 2 + 1px);
			background: linear-gradient(
				to bottom,
				transparent var(--itunes-content-spacing),
				#7f7f7f var(--itunes-content-spacing),
				#7f7f7f calc(var(--itunes-content-spacing) + 1px),
				transparent calc(var(--itunes-content-spacing) + 1px)
			);
			padding-inline: 5px;
			background-clip: content-box;
		}
	}

	/* #region Albums */
	.itunesAlbumDetailsCell {
		padding: 0;
		vertical-align: top;
		border-right: none;
		&,
		&:active {
			background: white;
		}
	}

	.itunesAlbumDetails {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--itunes-content-spacing);
	}

	.itunesAlbumArt,
	.itunesAlbumArtReflection {
		width: 100%;
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
	.itunesTrackNameCell,
	.itunesTrackLoved,
	.itunesTrackLastPlayed {
		padding: 0 calc(var(--itunes-content-spacing) / 2);
	}

	.itunesTrackNameCell {
		padding-inline-start: var(--itunes-content-spacing);
		display: flex;
		align-items: center;
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
		text-align: center;
		color: #808080;
	}

	.itunesTrackLastPlayed {
		padding-inline-end: 0;
	}

	/* #region Status Bar */

	.itunes :global(.windowStatusBar) {
		top: calc(100% - (var(--status-bar-height) - var(--window-brushed-bottom-padding)));
		height: var(--status-bar-height);
		display: flex;
		align-items: center;
		padding-inline-start: 7px;
	}

	.aqua-button.metal {
		/* TODO make non-iTunes version */
		--button-gradient: #e3e3e3, #b1b1b1;
		--button-height: 30px;
		--button-padding: 8px;
		--drop-shadow-color: white;
		box-shadow:
			var(--widget-unified-box-shadow),
			inset 0 3px 1px 0 white,
			inset 0 -1px 1px #858585;
		border-radius: 4px;
		min-width: auto;

		:global(svg) {
			opacity: 1;
			filter: drop-shadow(0 1px 0 var(--drop-shadow-color));
			color: #3d3d3d;

			:global(.window.inactive) & {
				color: #858585;
			}
		}

		&:active {
			--button-gradient: #858585, #b4b4b4;
			--button-border-gradient: #2b2b2b, #505050;
			--drop-shadow-color: #cdcdcd;
			box-shadow:
				var(--widget-unified-box-shadow),
				inset 0 1px 2px #2b2b2b,
				inset 0 -1px 0 0 #a6a6a6;
		}
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
