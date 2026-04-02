<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, type FadeParams } from 'svelte/transition';

	interface BlueskyPlayIconProps extends HTMLAttributes<HTMLDivElement> {
		blocked?: boolean;
		fadeParams?: FadeParams;
	}

	const { blocked, fadeParams, ...rest }: BlueskyPlayIconProps = $props();
</script>

<div
	class={['blueskyPlayIcon', { blocked }]}
	{...rest}
	transition:fade={fadeParams ?? { duration: 0 }}
>
	▶
</div>

<style>
	.blueskyPlayIcon {
		--gray: #333333;
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 72px;
		height: 72px;
		display: grid;
		place-items: center;
		padding-left: 7.5px;
		background-color: white;
		border-radius: 50%;
		font-size: 42px;
		color: var(--gray);
		opacity: 0.75;
		-webkit-user-select: none;
		user-select: none;

		&.blocked::after {
			content: '';
			box-sizing: content-box;
			position: absolute;
			width: 5px;
			height: 70%;
			rotate: -60deg;
			padding: 2px;
			background:
				linear-gradient(to bottom, var(--gray), var(--gray)) content-box,
				linear-gradient(to bottom, white, white);
		}
	}
</style>
