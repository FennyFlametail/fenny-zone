<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface BlueskyPlayIconProps extends HTMLAttributes<HTMLDivElement> {
		blocked?: boolean;
	}

	const { blocked, ...rest }: BlueskyPlayIconProps = $props();
</script>

<div
	class={['blueskyPlayIcon', { blocked }]}
	aria-hidden={!blocked}
	aria-label="Can't play video"
	{...rest}
>
	▶
</div>

<style>
	.blueskyPlayIcon {
		--gray: #333333;
		border: none;
		padding: 0;
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
