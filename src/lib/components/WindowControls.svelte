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
		class={['windowButton', 'close', app.instance?.modified && 'modified']}
		aria-label="Close"
		onclick={() => windowServer.closeApp(appName)}
		href={app.backTo ?? '/'}
	>
		<X class="windowButtonGlyph" size={14} />
	</svelte:element>
	<button class="windowButton minimize" aria-label="Minimize" disabled={!browser}>
		<Minus class="windowButtonGlyph" size={14} />
	</button>
	<button
		class="windowButton maximize"
		aria-label="Maximize"
		onclick={() => windowServer.zoomApp(appName)}
		disabled={!browser}
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
		display: flex;
		justify-content: center;
		align-items: center;

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
	}
</style>
