<script lang="ts" generics="ThisCharacter extends CharacterName">
	import { getWindowServerContext } from '$lib/context.svelte';
	import { type CharacterName, relationships } from '$lib/data/relationships';

	const windowServer = getWindowServerContext();

	const {
		character,
		relationships: relationshipsProp
	}: {
		character: ThisCharacter;
		relationships: Exclude<CharacterName, ThisCharacter>[];
	} = $props();
</script>

{#if relationshipsProp?.length}
	<div class="profileRelationships profileSection">
		<h3 class="profileSectionHeading">Relationships</h3>
		{#each relationshipsProp as other}
			{@const relationship = relationships[character][other]}
			<details class="profileRelationshipBlock">
				<summary>{windowServer.apps[other].title}</summary>
				<h4>How they met:</h4>
				<p>{relationship.met}</p>
				<h4>Their relationship:</h4>
				<p>{relationship.details}</p>
			</details>
		{/each}
	</div>
{/if}

<style>
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

			&:focus-visible {
				box-shadow: var(--focus-box-shadow);
				outline: none;
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
</style>
