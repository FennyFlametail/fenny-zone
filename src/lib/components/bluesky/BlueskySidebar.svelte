<script lang="ts">
	import type { BlueskyProfile } from '$lib/helpers/fetchBlueskyData.server';
	import {
		AtSign,
		List,
		Mail,
		MessageCircle,
		MessageCircleX,
		Repeat2,
		Search,
		Star,
		User
	} from 'lucide-svelte';
	import { SvelteSet } from 'svelte/reactivity';

	const {
		profile,
		userSheetIsOpen
	}: {
		profile: BlueskyProfile | null;
		userSheetIsOpen: boolean;
	} = $props();

	let highlightedTabs = $state(new SvelteSet<number>([]));

	const tabs: [
		any,
		{
			classes?: string[];
			iconClass?: string[];
			strokeWidth?: number;
		}
	][] = [
		[MessageCircle, { iconClass: ['fill'] }],
		[AtSign, { strokeWidth: 3 }],
		[Mail, { iconClass: ['fill'] }],
		[Star, { iconClass: ['fill'] }],
		[Search, { strokeWidth: 4 }],
		[User, { classes: ['highlighted', 'selected'], iconClass: ['fill'], strokeWidth: 0 }],
		[List, { strokeWidth: 3 }],
		[Repeat2, { strokeWidth: 3 }],
		[MessageCircleX, { iconClass: ['fill'] }]
	];
</script>

<div class="blueskySidebar" data-allow-window-drag inert={userSheetIsOpen}>
	<div class="blueskyAvatar">
		<img src={profile?.avatar} alt="" draggable="false" width={35} height={35} />
	</div>
	<div class="blueskyTabContainer">
		{#each tabs as [Icon, { classes = [], iconClass = [], strokeWidth }], index (index)}
			{@const highlighted = highlightedTabs.has(index)}
			<button
				class={['blueskyTab', highlighted && 'highlighted', ...classes]}
				onclick={/* () => (highlighted ? highlightedTabs.delete(index) : highlightedTabs.add(index)) */
				() => {}}
				disabled
				aria-hidden="true"
			>
				<div class="blueskyTabIconWrapper">
					<Icon class={['blueskyTabIcon', ...iconClass].join(' ')} {strokeWidth} />
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.blueskySidebar {
		min-height: 0;
		grid-area: 'sidebar';
		padding: var(--spacing);
		display: flex;
		flex-direction: column;
		gap: var(--spacing);
		background-color: #4f5153;
		border-right: 1px solid black;
	}

	.blueskyAvatar {
		--top-highlight: #a9adb1;
		height: auto;
		width: auto;
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		border: 1px solid black;
		background-image: linear-gradient(to bottom, #92969a, #7b8084);
		box-shadow: 0 1px 1px 0 #6d6f71;

		&.highlighted {
			box-shadow: 0 0 5px 2px #3793e7;
		}

		&:active {
			--top-highlight: #2f3132;
			background-image: linear-gradient(to bottom, #3d3f41, #3d3f41);
		}

		&::after {
			border-radius: 4px;
			box-shadow: inset 0 1px 0 0 var(--top-highlight);
		}

		img {
			border: 1px solid black;
			border-radius: 3px;
		}
	}

	.blueskyTabContainer {
		position: relative;
		display: flex;
		flex-flow: column;
		gap: 1px;
		border: 1px solid black;
		border-radius: 5px;
		background-color: black;
		box-shadow: 0 1px 1px 0 #6d6f71;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			height: 100%;
			width: 100%;
			border-radius: 4px;
			border-top: 1px solid #2f3132;
			pointer-events: none;
		}
	}

	.blueskyTab {
		all: unset;
		display: grid;
		grid-template: 'indicator icon' 44px / 5px 1fr;
		gap: 1px;

		/* indicator */

		&::after {
			grid-area: indicator;
			content: '';
			background: #4c4f51;
			border-top: 1px solid #5e6163;
			border-right: 1px solid #5e6163;
		}

		&.highlighted::after {
			background: linear-gradient(to right, #2182db, #3793e7);
			border-top: none;
			border-right-color: #48b8f7;
			isolation: isolate;
		}

		&.highlighted::before {
			grid-area: indicator;
			content: '';
			background-color: #3793e7;
			scale: 1.75 1.25;
			filter: blur(4px);
		}
	}

	.blueskyTabIconWrapper {
		--background: #3d3f41;
		grid-area: icon;
		display: grid;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #515354;
		border-bottom: 1px solid transparent;
		background-color: var(--background);

		.blueskyTab.selected &,
		.blueskyTab:active & {
			--background: #242425;
			border-top-color: #1d1d1e;
		}
	}

	.blueskyTab.highlighted :global(.blueskyTabIcon) {
		--gradient: url('#tabHighlightedIconGradient');
		filter: var(--outline-shadow) var(--glow-drop-shadow);

		&.lucide-list {
			stroke: #42a1f5;
		}
	}
</style>
