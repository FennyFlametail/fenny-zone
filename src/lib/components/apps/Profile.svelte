<script lang="ts" generics="ThisCharacter extends CharacterName">
	import ProfilePhoto from '$lib/components/apps/ProfilePhoto.svelte';
	import ProfileRelationships from '$lib/components/apps/ProfileRelationships.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { type CharacterName } from '$lib/data/relationships';
	import type { Snippet } from 'svelte';

	const {
		character,
		fullName,
		species,
		icon,
		iconAlt,
		photo,
		photoAlt,
		bio,
		tabs,
		relationships: relationshipsProp,
		links
	}: {
		character: ThisCharacter;
		fullName: string;
		species: string;
		icon: string;
		iconAlt: string;
		bio: Snippet;
		tabs?: Snippet;
		relationships: Exclude<CharacterName, ThisCharacter>[] | Snippet;
		links: Snippet;
	} & (
		| {
				/** Photos should be 725x1024 */
				photo: string;
				photoAlt: string;
		  }
		| {
				photo: Snippet;
				photoAlt?: never;
		  }
	) = $props();
	const nameId = $props.id();

	const windowServer = getWindowServerContext();
</script>

<article class="profile brushedInset" aria-labelledby={nameId}>
	<header class="profileHeader">
		<img class="profileIcon" src={icon} alt={iconAlt} draggable="false" />
		<hgroup>
			<h3 id={nameId} class="profileName">{fullName}</h3>
			<p class="profileSpecies">{species}</p>
		</hgroup>
	</header>
	<div class="profilePhotoWrapper">
		{#if typeof photo === 'string'}
			<ProfilePhoto {photo} alt={photoAlt!} />
		{:else}
			{@render photo()}
		{/if}
	</div>
	{#if tabs}
		<div class="profileTabs">
			{@render tabs()}
		</div>
	{/if}
	<div class="profileBio profileSection">
		{@render bio()}
	</div>
	{#if Array.isArray(relationshipsProp)}
		<ProfileRelationships {character} relationships={relationshipsProp} />
	{:else}
		{@render relationshipsProp()}
	{/if}
	<div class="profileLinks profileSection">
		<h3 class="profileSectionHeading">Links</h3>
		{@render links()}
	</div>
</article>

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

		> :global(*, .tabBarContentSnippet > *) {
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
		-webkit-user-select: none;
		user-select: none;
	}

	.profileName {
		font-size: 24px;
		line-height: 1.2;
	}

	@scope (.profile) {
		:global(.profileSectionHeading) {
			padding-inline: var(--profile-spacing);
			margin-bottom: var(--profile-spacing);
			-webkit-user-select: none;
			user-select: none;
		}
	}

	@scope (.profileSection) {
		:global {
			dl {
				display: grid;
				grid-template-columns: 120px auto;
				column-gap: 20px;
				row-gap: 10px;
				text-wrap: pretty;
			}

			dt {
				text-align: end;
				font-weight: bold;
				text-transform: lowercase;
				color: var(--text-secondary);
			}

			dd {
				min-width: 0;
			}

			ul {
				padding-inline-start: 20px;
			}

			li {
				list-style-type: circle;
			}

			.profileColor {
				padding: 0.2em;
				border-radius: 0.2em;
			}
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

	@container window (width < 1000px) {
		.profile {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-inline: 10px;
		}
		.profileTabs {
			align-self: center;
		}
		.profilePhotoWrapper {
			margin-block: -15px;
			position: static;
			height: 60cqh;
			align-self: center;
			mask: linear-gradient(to bottom, white calc(100% - 10px), transparent);
		}
	}
</style>
