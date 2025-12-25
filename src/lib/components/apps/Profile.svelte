<script lang="ts">
	import AppLink from '$lib/components/AppLink.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { type CharacterName, relationships } from '$lib/data/relationships';
	import type { Snippet } from 'svelte';

	const {
		character,
		species,
		iconAlt,
		photo,
		photoAlt,
		bio,
		links
	}: {
		character: CharacterName;
		species: string;
		iconAlt: string;
		photo: string;
		photoAlt: string;
		bio: Snippet;
		links: Snippet;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[character];
</script>

<div class="profile brushedInset">
	<div class="profileText">
		<header class="profileHeader">
			<img class="profileIcon" src={app.icon} alt={iconAlt} draggable="false" />
			<hgroup>
				<h3 class="profileName">{app.windowTitle}</h3>
				<p class="profileSpecies">{species}</p>
			</hgroup>
		</header>
		<div class="profileBio profileSection">
			{@render bio()}
		</div>
		{#if relationships[character]}
			<div class="profileRelationships profileSection">
				<h3 class="profileSubheading">Relationships</h3>
				<dl>
					{#each Object.entries(relationships[character]) as [CharacterName, string][] as [other, text]}
						<dt>
							<AppLink appName={other}>{windowServer.apps[other].title}</AppLink>
						</dt>
						<dd>{text}</dd>
					{/each}
				</dl>
			</div>
		{/if}
		<div class="profileLinks profileSection">
			<h3 class="profileSubheading">Links</h3>
			{@render links()}
		</div>
	</div>
	<img class="profilePhoto" src={photo} alt={photoAlt} draggable="false" />
</div>

<style>
	.profile {
		height: 100%;
		display: grid;
		grid-template-columns: auto minmax(64px, auto);
		background-color: white;
		padding-inline-start: 10px;
		gap: 25px;
		overflow-y: auto;
	}

	.profileText {
		max-width: 768px;
		display: flex;
		flex-flow: column;
		gap: 25px;
		padding-block: 25px;
	}

	.profileHeader {
		display: flex;
		align-items: flex-start;
		padding-inline: 25px;
		gap: 10px;

		h3 {
			text-box-trim: trim-start;
			text-box-edge: cap text;
		}
	}

	.profileIcon {
		width: 64px;
		height: 64px;
	}

	.profileName {
		font-size: 24px;
	}

	.profileSubheading {
		padding-inline: 25px;
		margin-bottom: 25px;
	}

	:where(.profile) :global(dl) {
		display: grid;
		grid-template-columns: 120px auto;
		column-gap: 20px;
		row-gap: 10px;
		text-wrap: pretty;

		:global(dt) {
			-webkit-user-select: none;
			user-select: none;
			text-align: end;
			font-weight: bold;
			text-transform: lowercase;
			color: var(--text-secondary);
		}

		:global(dd) {
			min-width: 0;
		}

		:global(ul) {
			padding-inline-start: 20px;
		}

		:global(li) {
			list-style-type: circle;
		}

		:global(.profileColor) {
			padding: 0.2em;
			border-radius: 0.2em;
		}
	}

	.profileRelationships dt {
		text-transform: none;
	}

	.profilePhoto {
		position: sticky;
		bottom: 0;
		right: 0;
		justify-self: end;
		align-self: end;
		object-fit: contain;
		object-position: bottom right;
		-webkit-user-select: none;
		user-select: none;
		pointer-events: none;

		@container window (height > 0) {
			height: calc(100cqh - 2px);
		}
	}

	@container window (width < 768px) {
		.profile {
			grid-template-columns: auto;
			gap: 0;
			padding-inline: 10px;
		}
		.profilePhoto {
			position: static;
			justify-self: center;
			object-position: bottom center;
		}
	}
</style>
