<script lang="ts">
	import WindowControls from '$lib/components/WindowControls.svelte';
	import type { BlueskyProfile } from '$lib/helpers/fetchBlueskyData.server';
	import { User } from 'lucide-svelte';

	const {
		profile,
		userSheetIsOpen,
		openUserSheet,
		closeUser,
		scrollToTop
	}: {
		profile: BlueskyProfile | null;
		userSheetIsOpen: boolean;
		openUserSheet: () => void;
		closeUser: () => void;
		scrollToTop: () => void;
	} = $props();

	let titlebar = $state<HTMLDivElement>();
	let lastX = $state(0);
	let lastY = $state(0);

	function onTitleDown() {
		if (!titlebar) return;
		const { left, top } = titlebar.getBoundingClientRect();
		lastX = left;
		lastY = top;
	}
	function onTitleUp() {
		if (!titlebar) return;
		const { left, top } = titlebar.getBoundingClientRect();
		if (Math.abs(left - lastX) < 1 && Math.abs(top - lastY) < 1) {
			scrollToTop();
		}
	}
</script>

<div bind:this={titlebar} class="blueskyTitlebar" data-allow-window-drag>
	<WindowControls />
	<button class="blueskyUserBackButton" onclick={closeUser} disabled={userSheetIsOpen}>
		fenny.zone
	</button>
	<button
		class="blueskyWindowTitle"
		onpointerdown={onTitleDown}
		onpointerup={onTitleUp}
		data-allow-window-drag
		title="Scroll to top"
		disabled={userSheetIsOpen}
	>
		<h2 data-allow-window-drag>{profile?.displayName}</h2>
	</button>
	<button
		class="blueskyChangeUserButton"
		onclick={openUserSheet}
		title="Go to User"
		disabled={userSheetIsOpen}
	>
		<User class="blueskyTabIcon fill" strokeWidth={0} />
	</button>
</div>

<style>
	:global {
		#root .window[data-appname='bluesky'] {
			--sidebar-width: 65px;
			--spacing: 10px;
			--window-radius: 5px;
			--titlebar-height: 35px;
			--titlebar-gradient: linear-gradient(
				to bottom,
				#59595c 1px,
				#4b4c4f 1px,
				#4b4c4f 2px,
				#444548 2px,
				#2a2b2d
			);
			--glow-drop-shadow: drop-shadow(0 0 5px #3793e7);
			--text-medium: #2d2f31;
			--text-light: #81878b;

			background-color: #2a2b2d;
			background-image: none;
			background-clip: padding-box;
			border-color: rgb(0 0 0 / 75%);
			border-radius: 5px;

			.windowControls {
				grid-area: controls;
				width: calc(var(--sidebar-width) + 1px);
				height: 100%;
				padding-inline: 6px;
				justify-content: space-between;
				gap: 0;
				background-image: linear-gradient(
					to left,
					#535357 1px,
					#18191a 1px,
					#18191a 2px,
					transparent 2px
				);

				.window.inactive & {
					background-image: linear-gradient(
						to left,
						#535357 1px,
						#2e2f31 1px,
						#2e2f31 2px,
						transparent 2px
					);
				}
			}

			.windowButton {
				width: 12px;
				height: 12px;
				box-shadow: 0 1px 1px rgb(255 255 255 / 15%);
			}

			.windowContent {
				grid-template:
					'titlebar titlebar' var(--titlebar-height)
					'sidebar content' 1fr
					'footer footer' 25px / var(--sidebar-width) auto;
			}
		}
	}

	.blueskyTitlebar {
		grid-area: titlebar;
		position: relative;
		display: grid;
		grid-template: 'controls title userButton' / auto 1fr auto;
		background-image: var(--titlebar-gradient);
		border-bottom: 1px solid black;
		border-top-left-radius: calc(var(--window-radius) - 1px);
		border-top-right-radius: calc(var(--window-radius) - 1px);
		-webkit-user-select: none;
		user-select: none;

		:global(.window.inactive) & {
			background-image: linear-gradient(to bottom, #57585b 1px, #444548 1px, #444548);
		}
	}

	.blueskyUserBackButton {
		--inset: 0px;
		--gradient-dir: bottom;
		all: unset;
		box-sizing: border-box;
		grid-area: title;
		align-self: center;
		justify-self: start;
		position: relative;
		display: grid;
		place-items: center;
		height: 26px;
		margin-left: 5px;
		padding-left: 22px;
		padding-right: 10px;
		background: linear-gradient(to var(--gradient-dir), #1a1a1c, #111213);
		color: white;
		font-size: 12px;
		text-shadow: 0 -1px var(--text-medium);
		cursor: pointer;

		&,
		&::before,
		&::after {
			border-top-right-radius: calc(3px - var(--inset) * 0.25);
			border-bottom-right-radius: calc(3px - var(--inset) * 0.25);
			clip-path: polygon(
				100% 0%,
				100% 100%,
				calc(12px - var(--inset) / 4) 100%,
				calc(var(--inset) / 4) calc(50% + 0.5px),
				calc(var(--inset) / 4) 50%,
				calc(var(--inset) / 4) calc(50% - 0.5px),
				calc(12px - var(--inset) / 4) 0%
			);
		}

		&::before,
		&::after {
			content: '';
			display: block;
			position: absolute;
			z-index: -1;
			width: calc(100% - var(--inset));
			height: calc(100% - var(--inset));
		}

		&::before {
			--inset: 2px;
			background: linear-gradient(to var(--gradient-dir), #7b7c7f, #4e4e51);
		}

		&::after {
			--inset: 4px;
			background: linear-gradient(to var(--gradient-dir), #606063, #3f3f42);
		}

		&:active {
			--gradient-dir: top;
		}
	}

	.blueskyWindowTitle {
		all: unset;
		grid-area: title;

		&:not(:disabled) {
			cursor: pointer;
		}

		h2 {
			text-align: center;
			font-size: 14px;
			color: white;
			text-shadow: 0 -1px black;

			:global(.window.inactive) & {
				color: #c7c7c8;
			}
		}
	}

	.blueskyChangeUserButton {
		--gradient: url('#tabIconGradient');
		all: unset;
		grid-area: userButton;
		padding-inline: 5px;
		cursor: pointer;

		&:focus-visible {
			filter: var(--glow-drop-shadow);

			:global(svg) {
				fill: url('#tabHighlightedIconGradient');
			}
		}

		&:disabled {
			cursor: default;
		}

		&:active:not(:disabled) :global(.blueskyTabIcon) {
			--gradient: url('#tabIconActiveGradient');
		}

		:global(.window.inactive) & :global(.blueskyTabIcon),
		&:disabled :global(.blueskyTabIcon) {
			--gradient: url('#tabIconDisabledGradient');
		}

		@media (scripting: none) {
			display: none;
		}
	}
</style>
