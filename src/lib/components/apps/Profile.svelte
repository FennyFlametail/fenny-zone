<script lang="ts" generics="ThisCharacter extends CharacterName">
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
		tabs,
		relationships: relationshipOrder,
		links
	}: {
		character: ThisCharacter;
		species: string;
		iconAlt: string;
		/** Photos should be 725x1024 */
		photo: string;
		photoAlt: string;
		bio: Snippet;
		tabs?: Snippet;
		relationships: Exclude<CharacterName, ThisCharacter>[];
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
	<div class="profilePhotoWrapper">
		<img
			class="profilePhoto"
			src={photo}
			alt={photoAlt}
			width={725}
			height={1024}
			draggable="false"
		/>
	</div>
	{#if tabs}
		<div class="profileTabs">
			{@render tabs()}
		</div>
	{/if}
	<div class="profileBio profileSection">
		{@render bio()}
	</div>
	{#if relationshipOrder?.length}
		<div class="profileRelationships profileSection">
			<h3 class="profileSectionHeading">Relationships</h3>
			{#each relationshipOrder as other}
				{@const relationship = relationships[character][other]}
				<details class="profileRelationshipBlock">
					<summary>{windowServer.apps[other].title}</summary>
					<h4>How they met:</h4>
					<p>{relationship.met}</p>
					<h4>How they view each other:</h4>
					<p>{relationship.views}</p>
				</details>
			{/each}
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

		> :global(*) {
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

	.profileTabs {
		justify-self: center;
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
		-webkit-user-select: none;
		user-select: none;
	}

	@scope (.profileSection) {
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

	.profileRelationshipBlock {
		padding-inline: var(--profile-spacing);

		&,
		&::details-content {
			display: flex;
			flex-flow: column;
			gap: var(--profile-spacing);
		}

		summary {
			font-weight: bold;
			-webkit-user-select: none;
			user-select: none;
			list-style-type: none;
			&::before {
				display: inline-block;
				content: '▶';
				color: var(--text-secondary);
				font-size: 0.9em;
				margin-right: 10px;
				transition: rotate 0.25s;
			}
		}

		&[open] summary::before {
			rotate: 90deg;
		}

		&[open]::details-content {
			padding-bottom: var(--profile-spacing);
		}

		p {
			white-space: pre-line;
		}
	}

	.profileLinks {
		margin-bottom: var(--profile-spacing);
	}

	.profilePhotoWrapper {
		grid-column: 2;
		justify-self: end;
		position: sticky;
		top: 0;
		/* make sure the photo doesn't stretch the row it's in */
		height: 0;
		overflow: visible;
	}

	.profilePhoto {
		width: auto;
		height: calc(100cqh - 2px);
		object-fit: contain;
		object-position: bottom right;
		-webkit-user-select: none;
		user-select: none;
		pointer-events: none;
	}

	@container window (width < 768px) {
		.profile {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-inline: 10px;
		}
		.profileTabs {
			align-self: center;
			margin-block-end: -15px;
		}
		.profilePhotoWrapper {
			margin-block: -15px;
			position: static;
			height: 60cqh;
			align-self: center;
			mask: linear-gradient(to bottom, white calc(100% - 10px), transparent);
		}
		.profilePhoto {
			height: 100%;
		}
	}
</style>
