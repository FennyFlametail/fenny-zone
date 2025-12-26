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
		showRelationships = true,
		links
	}: {
		character: CharacterName;
		species: string;
		iconAlt: string;
		photo: string;
		photoAlt: string;
		bio: Snippet;
		showRelationships?: boolean;
		links: Snippet;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[character];
</script>

<div class="profile brushedInset">
	<header class="profileHeader">
		<img class="profileIcon" src={app.icon} alt={iconAlt} draggable="false" />
		<hgroup>
			<h3 class="profileName">{app.windowTitle}</h3>
			<p class="profileSpecies">{species}</p>
		</hgroup>
	</header>
	<img class="profilePhoto" src={photo} alt={photoAlt} draggable="false" />
	<div class="profileBio profileSection">
		{@render bio()}
	</div>
	{#if showRelationships && relationships[character]}
		<div class="profileRelationships profileSection">
			<h3 class="profileSectionHeading">Relationships</h3>
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
		<h3 class="profileSectionHeading">Links</h3>
		{@render links()}
	</div>
</div>

<style>
	.profile {
		--profile-spacing: 25px;
		height: 100%;
		display: grid;
		grid-template-columns: minmax(auto, 768px) minmax(64px, auto);
		justify-content: center;
		background-color: white;
		padding-inline-start: 10px;
		gap: var(--profile-spacing);
		overflow-y: auto;

		> * {
			grid-column: 1;
		}
	}

	.profileHeader {
		margin-top: var(--profile-spacing);
		display: flex;
		align-items: flex-start;
		padding-inline: var(--profile-spacing);
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
		line-height: 1.2;
	}

	.profileSectionHeading {
		padding-inline: var(--profile-spacing);
		margin-bottom: var(--profile-spacing);
	}

	@scope (.profileSection) {
		:scope {
			display: flex;
			flex-direction: column;
		}

		:global(dl) {
			display: grid;
			grid-template-columns: 120px auto;
			column-gap: 20px;
			row-gap: 10px;
			text-wrap: pretty;
		}

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

	.profileLinks {
		margin-bottom: var(--profile-spacing);
	}

	.profilePhoto {
		grid-row: 2;
		/* FIXME this makes it stretch column 2 (the bio) if the window is really big */
		grid-column: 2;
		position: sticky;
		top: 0;
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
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-inline: 10px;
		}
		.profilePhoto {
			margin-block: -15px;
			position: static;
			height: 60cqh;
			align-self: center;
			mask: linear-gradient(to bottom, white calc(100% - 10px), transparent);
		}
	}
</style>
