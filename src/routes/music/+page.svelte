<script lang="ts">
	import { browser } from '$app/environment';
	import Table from '$lib/components/Table.svelte';
	import WindowSidebar from '$lib/components/WindowSidebar.svelte';
	import WindowSidebarItem from '$lib/components/WindowSidebarItem.svelte';
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import TableController, { type ColumnOptions } from '$lib/helpers/TableController.svelte';
	import itunesBrowseIcon from '$lib/images/icons/itunes-browse.png';
	import itunesLibraryIcon from '$lib/images/icons/itunes-library.png';
	import { fromUnixTime, intlFormat } from 'date-fns';
	import { decode } from 'html-entities';
	import { ArrowBigRight, FastForward, Play, Rewind } from 'lucide-svelte';
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

	const columns: ColumnOptions<MusicTrack> = {
		name: {
			header: 'Name',
			cell: linkCell
		},
		artist: {
			header: 'Artist',
			cell: linkCell
		},
		album: {
			header: 'Album',
			cell: linkCell
		},
		loved: {
			header: 'My Rating',
			defaultSort: 'desc',
			cell: lovedCell
		},
		lastPlayed: {
			header: 'Last Played',
			defaultSort: 'desc',
			cell: dateCell
		}
	};

	const controller = $derived.by(() => {
		if (!profile?.recents) {
			return new TableController({
				data: [],
				columns
			});
		}

		return new TableController({
			data: profile.recents,
			columns,
			initialSortKey: 'lastPlayed'
		});
	});

	function openHandler(track: MusicTrack) {
		return () => open(track.link, '_blank');
	}
</script>

<div class="itunes brushedNoInset">
	<WindowToolbar>
		<div class="itunesTrackControls" data-allow-window-drag aria-hidden="true">
			<div class="aqua-button circle disabled">
				<Rewind size={28} />
			</div>
			<div class="aqua-button circle large disabled">
				<Play size={44} />
			</div>
			<div class="aqua-button circle disabled">
				<FastForward size={28} />
			</div>
			<input type="range" class="itunesVolumeSlider" tabindex="-1" />
		</div>
		<div class="itunesStatusWindow" data-allow-window-drag></div>
		<a
			class="aqua-button-with-label noJS-pointer"
			href={profile?.url}
			target="_blank"
			aria-labelledby="itunesProfileButtonLabel"
		>
			<div class={['aqua-button', 'circle', 'large', { disabled: !profile?.url }]}>
				<img class="itunesBrowseIcon" src={itunesBrowseIcon} alt="" draggable="false" />
			</div>
			<span id="itunesProfileButtonLabel">Profile</span>
		</a>
	</WindowToolbar>

	<WindowSidebar
		type="iTunes"
		header="Source"
		lowerViewHeader={browser ? 'Selected Song' : undefined}
	>
		<WindowSidebarItem selected>
			<button class="itunesSidebarItem">
				<img src={itunesLibraryIcon} alt="" draggable="false" />
				<span>Recent Tracks</span>
			</button>
		</WindowSidebarItem>
		{#snippet lowerView()}
			{#if browser}
				{#if controller.selected}
					<img
						class="itunesAlbumArt"
						src={controller.selected?.image}
						alt="Album art for {controller.selected.name} by {controller.selected.artist}"
						draggable={false}
					/>
				{:else}
					<div class="itunesAlbumArt placeholder">Nothing<br />Selected</div>
				{/if}
			{/if}
		{/snippet}
	</WindowSidebar>

	<div class="itunesSongList">
		<Table {controller} rowHeight={24} />
	</div>
</div>

{#snippet linkCell(item: MusicTrack, key: keyof MusicTrack)}
	{@const link = key === 'name' ? item.link : key === 'artist' ? item.artistLink : item.albumLink}
	<td ondblclick={openHandler(item)}>
		<div class="itunesSongCell">
			<span title={decode(item[key] as string)}>{decode(item[key] as string)}</span>
			<a
				class="itunesSongLink noJS-pointer"
				href={link}
				title="View on Last.fm"
				aria-label="View on Last.fm"
				target="_blank"
			>
				<ArrowBigRight size={12} fill="currentColor" />
			</a>
		</div>
	</td>
{/snippet}

{#snippet lovedCell(item: MusicTrack)}
	<td class="itunesSongLoved" ondblclick={openHandler(item)} aria-label={item.loved ? 'Loved' : ''}
		>{item.loved ? '★★★★★' : ''}</td
	>
{/snippet}

{#snippet dateCell(item: MusicTrack)}
	<td ondblclick={openHandler(item)}
		>{intlFormat(fromUnixTime(item.lastPlayed), {
			dateStyle: 'short',
			timeStyle: 'short'
		}).replace(',', '')}</td
	>
{/snippet}

<style>
	.itunes {
		display: grid;
		grid-template:
			'toolbar toolbar' auto
			'sidebar content' 1fr / auto 1fr;
		column-gap: var(--titlebar-padding);
	}

	.itunes :global(.windowToolbar) {
		justify-content: space-between;
		align-items: start;
	}

	.itunesTrackControls {
		display: grid;
		grid-template:
			'prev play next'
			'slider slider slider';
		place-items: center;
		gap: 5px;
	}

	.aqua-button :global(.lucide-icon) {
		scale: 1 0.7;
		fill: currentColor;
		stroke: none;

		&:global(.lucide-rewind) {
			margin-right: 2px;
		}
		&:global(.lucide-play) {
			scale: 0.8 0.65;
		}
		&:global(.lucide-fast-forward) {
			margin-left: 2px;
		}
	}

	.itunesVolumeSlider {
		--thumb-inner-color: #616161;
		grid-area: slider;
		width: 104px;
		width: 137px;
		appearance: none;
		margin-block: 4px;
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

	.itunesStatusWindow {
		position: absolute;
		left: 50%;
		translate: -50%;
		width: 40cqw;
		height: 60px;
		border-radius: 9999px;
		border: 1px solid transparent;
		background:
			linear-gradient(to bottom, #d6dbbf, #d6dbbf) content-box,
			linear-gradient(to bottom, #737667, #f7f8f2) border-box;
		box-shadow: inset 0 3px 5px -3px black;
		display: grid;
		place-items: center;
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
			z-index: -1;
			background-color: #737667;
			scale: 0.9;
			translate: 0 3px;
			filter: blur(3px);
		}
	}

	.itunesBrowseIcon {
		width: 31px;
		height: 20px;
		image-rendering: pixelated;
	}

	.itunesSidebarItem {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 1px 5px;
		background: none;
		border: none;
		color: inherit;

		img {
			width: 16px;
			height: 16px;
			image-rendering: pixelated;
		}
	}

	.itunesAlbumArt {
		aspect-ratio: 1 / 1;
		object-fit: cover;

		&.placeholder {
			color: #c8c8c8;
			font-size: 14px;
			line-height: 1.7;
			font-weight: bold;
			align-content: center;
			text-align: center;
		}
	}

	.itunesSongList {
		grid-area: content;
		container: window / size;
		display: grid;
		grid-template: 100% / 100%;
	}

	td,
	.itunesSongCell span {
		font-size: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.itunesSongCell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5em;
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

	.itunesSongLoved {
		text-align: center;
		color: hsl(0 0 50%);

		:global(.tableRow.selected) & {
			color: inherit;
		}
	}
</style>
