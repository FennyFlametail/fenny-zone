<script lang="ts">
	import { browser } from '$app/environment';

	let container = $state<HTMLDivElement>();
	let eyes = $state([]) as unknown as [HTMLDivElement, HTMLDivElement];

	function findEyeCenter() {
		eyes.forEach((eye) => {
			const rect = eye.getBoundingClientRect();
			eye.style.setProperty('--centerX', `${rect.left + rect.width / 2}px`);
			eye.style.setProperty('--centerY', `${rect.top + rect.height / 2}px`);
		});
	}

	$effect(findEyeCenter);

	function onpointermove(e: PointerEvent) {
		container!.style.setProperty('--mouseX', `${e.clientX}px`);
		container!.style.setProperty('--mouseY', `${e.clientY}px`);
	}

	/*
	 * on pointerdown: start blink
	 * on pointerup:
	 * - if >=200ms have passed: stop blink when pointer released
	 * - if <200ms: stop blink when 200ms pass
	 */

	let pointerdown = $state(false);
	let blink = $state(false);
	let minBlinkTimePassed = $state(false);

	function onpointerdown(e: PointerEvent) {
		pointerdown = true;
		blink = true;
		minBlinkTimePassed = false;
		window.setTimeout(() => {
			minBlinkTimePassed = true;
		}, 200);

		// for touch devices
		container!.style.setProperty('--mouseX', `${e.clientX}px`);
		container!.style.setProperty('--mouseY', `${e.clientY}px`);
	}

	function onpointerup() {
		pointerdown = false;
		if (minBlinkTimePassed) blink = false;
	}

	$effect(() => {
		if (minBlinkTimePassed && !pointerdown) {
			blink = false;
		}
	});
</script>

{#if browser}
	<div class={['googlyEyeContainer', { blink }]} bind:this={container}>
		<div class="googlyEye" bind:this={eyes[0]}></div>
		<div class="googlyEye" bind:this={eyes[1]}></div>
	</div>
{/if}

<svelte:window onresize={findEyeCenter} />
<svelte:body
	{onpointermove}
	{onpointerdown}
	{onpointerup}
	onpointercancel={onpointerup}
	oncontextmenu={onpointerup}
/>

<style>
	.googlyEyeContainer {
		padding-inline: var(--menu-item-padding);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 1px;
	}

	.googlyEye {
		--eye-width: 20px;
		position: relative;
		width: var(--eye-width);
		height: var(--eye-width);
		border: 1px solid lightgray;
		border-radius: 50%;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;

		.googlyEyeContainer:not(.blink) & {
			--distanceX: calc(var(--mouseX) - var(--centerX));
			--distanceY: calc(var(--mouseY) - var(--centerY));
			--tan: atan2(var(--distanceX), var(--distanceY));
			--hypot: hypot(var(--distanceX), var(--distanceY));
			rotate: calc(var(--tan) * -1);

			@media (prefers-reduced-motion: reduce) {
				&:first-child {
					rotate: -45deg;
				}
				&:last-child {
					rotate: 45deg;
				}
			}

			&::after {
				--pupil-width: 8px;
				content: '';
				width: var(--pupil-width);
				height: var(--pupil-width);
				background: radial-gradient(circle at 50% 33%, hsl(0 0% 33%), black 50%);
				border-radius: 50%;

				/* subtract 1px for border */
				--max-offset: calc((var(--eye-width) - var(--pupil-width)) / 2 - 1px);
				translate: 0 clamp(0px, var(--hypot), var(--max-offset));
				rotate: var(--tan);

				@media (prefers-reduced-motion: reduce) {
					translate: 0 33%;
					rotate: 0deg;
				}
			}
		}

		.googlyEyeContainer.blink &::after {
			content: '';
			height: 1.5px;
			width: 75%;
			background-color: black;
		}
	}
</style>
