<script lang="ts">
	import { browser } from '$app/environment';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import { Minus, Plus, X } from 'lucide-svelte';

	const windowServer = getWindowServerContext();
	const { app, appName } = getAppContext();
</script>

<div class="windowControls" data-allow-window-drag>
	<svelte:element
		this={browser ? 'button' : 'a'}
		role={browser ? 'button' : 'link'}
		class={['windowButton', 'close', app.instance?.saveData && 'modified']}
		aria-label="Close"
		onclick={() => windowServer.closeApp(appName)}
		href={app.backTo ?? '/'}
	>
		<X class="windowButtonGlyph" size={14} />
	</svelte:element>
	<button
		class="windowButton minimize"
		aria-label="Minimize"
		disabled={!browser}
		aria-hidden={!browser}
		tabindex="-1"
	>
		<Minus class="windowButtonGlyph" size={14} />
	</button>
	<button
		class="windowButton maximize"
		aria-label="Maximize"
		onclick={() => windowServer.zoomApp(appName)}
		disabled={!browser || app.noResize}
		aria-hidden={!browser || app.noResize}
	>
		<Plus class="windowButtonGlyph" size={14} />
	</button>
</div>

<style>
	.windowControls {
		grid-area: title;
		align-self: center;
		justify-self: start;
		display: flex;
		align-items: center;
		gap: 9px;
		z-index: 1;
	}

	.windowButton {
		--base-box-shadow: inset 0 0 1px 1px rgb(0 0 0 / 50%), var(--widget-sunken-box-shadow);
		width: 18px;
		height: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 9999px;
		box-shadow: var(--base-box-shadow);
		background:
			/* top highlight */
			radial-gradient(ellipse 60% 30% at center top, white, rgb(255 255 255 / 80%), transparent)
				padding-box,
			/* bottom highlight */
				radial-gradient(ellipse 60% 70% at center bottom, white, white, transparent) padding-box,
			/* background color */
				linear-gradient(to bottom, var(--background-color), var(--background-color)) padding-box,
			/* border */ linear-gradient(to bottom, rgb(0 0 0 / 100%), rgb(0 0 0 / 50%)) border-box;
		background-repeat: no-repeat;
		background-color: var(--background-color);
		background-blend-mode: normal, overlay, normal, normal;

		@media (forced-colors: active) {
			&:enabled {
				border: 1px solid ButtonBorder;
			}
		}

		:global(.window.inactive) .windowControls:not(:hover, :focus-visible) &,
		&:disabled {
			--background-color: #b5b5b5 !important;
			opacity: 0.5;
		}

		/* TODO remove .minimize when minimize is implemented */
		&:active:not(:disabled, .minimize) {
			filter: brightness(0.75);
		}

		&:focus-visible {
			box-shadow: var(--base-box-shadow), var(--focus-box-shadow);
		}

		/* TODO remove when minimize is implemented */
		@media not (scripting: none) {
			&.minimize {
				cursor: not-allowed;
			}
		}
		@media (scripting: none) {
			&.minimize,
			&.maximize {
				cursor: not-allowed;
			}
		}

		&.close {
			--background-color: #c44a44;

			&.modified::after {
				position: absolute;
				border-radius: 50%;
				background-color: hsl(from var(--background-color) h s calc(l * 0.75));
				width: 8px;
				height: 8px;
				content: '';
			}
		}

		&.minimize {
			--background-color: #e89e28;
		}

		&.maximize {
			--background-color: #6aa71e;
		}
	}

	:global(.windowButtonGlyph) {
		--lightness: 0.9;
		transform: translateZ(0);
		visibility: hidden;
		mix-blend-mode: multiply;
		color: hsl(from var(--background-color) h s calc(l * var(--lightness)));
		stroke-width: 4;
		stroke-linecap: square;

		@media (forced-colors: active) {
			mix-blend-mode: normal;
			color: CanvasText;
		}

		.windowButton.modified :global(&) {
			display: none;
		}

		.windowButton.minimize :global(&) {
			--lightness: 0.8;
		}

		.windowControls:is(:hover, :focus-visible, :has(.windowButton:active))
			.windowButton:not(:disabled)
			:global(&) {
			visibility: visible;
		}
	}
</style>
