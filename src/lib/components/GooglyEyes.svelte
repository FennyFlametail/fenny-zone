<script lang="ts">
	let container: HTMLDivElement;
	let eyes = [] as unknown as [HTMLDivElement, HTMLDivElement];

	function findEyeCenter() {
		eyes.forEach((eye) => {
			const rect = eye.getBoundingClientRect();
			eye.style.setProperty('--centerX', `${rect.left + rect.width / 2}px`);
			eye.style.setProperty('--centerY', `${rect.top + rect.height / 2}px`);
		});
	}

	$effect(findEyeCenter);

	function onpointermove(e: PointerEvent) {
		container.style.setProperty('--mouseX', `${e.clientX}px`);
		container.style.setProperty('--mouseY', `${e.clientY}px`);
	}

	let blink = $state(false);
	let blinkStartTimeout = $state<number>();
	let blinkResetTimeout = $state<number>();

	function onmousedown() {
		blink = false;
		clearTimeout(blinkStartTimeout);
		blinkStartTimeout = setTimeout(() => {
			blink = true;
			clearTimeout(blinkResetTimeout);
			blinkResetTimeout = setTimeout(() => (blink = false), 200);
		}, 50);
	}
</script>

<div class={['container', { blink }]} bind:this={container}>
	<div class="eye" bind:this={eyes[0]}></div>
	<div class="eye" bind:this={eyes[1]}></div>
</div>

<svelte:window onresize={findEyeCenter} />
<svelte:body {onpointermove} {onmousedown} />

<style>
	.container {
		padding-inline: var(--menu-item-padding);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 1px;
	}

	.eye {
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

		.container:not(.blink) & {
			--distanceX: calc(var(--mouseX) - var(--centerX));
			--distanceY: calc(var(--mouseY) - var(--centerY));
			--tan: atan2(var(--distanceX), var(--distanceY));
			--hypot: hypot(var(--distanceX), var(--distanceY));
			rotate: calc(var(--tan) * -1);

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
			}
		}

		.container.blink &::after {
			content: '';
			height: 1.5px;
			width: 75%;
			background-color: black;
		}
	}
</style>
