<script lang="ts">
	import { closeAll, resetApps } from '$lib/components/WindowServer.svelte';

	let menubar: HTMLElement;

	function menuHover(e: PointerEvent) {
		let isOpenMenu = menubar.querySelector('details[open]');
		if (!isOpenMenu) return;
		const details = e.currentTarget as HTMLDetailsElement;
		if (!details.open) {
			// open this menu, which will close the currently open one
			details.open = true;
		}
	}

	function dismissMenu(e: MouseEvent) {
		const openMenu = menubar.querySelector('details[open]');
		if (!openMenu) return;
		if (e.composedPath().some((el) => (el as Element).classList?.contains('menuName'))) {
			e.preventDefault();
		}
		// TODO flash menu item if clicked
		openMenu.removeAttribute('open');
	}
</script>

<div class="menubarShadow"></div>

<!-- TODO better keyboard navigation (inert?) -->
<header bind:this={menubar} class="menubar">
	<details class="menuWrapper" name="menubar" onpointerenter={menuHover}>
		<summary class="menuName">
			<span class="menuLogo">🦊</span>
		</summary>
		<menu class="menu">
			<li class="menuItem">
				<button>Menu Item Button</button>
			</li>
			<li class="menuItem">
				<a class="menuItem" href="/" draggable="false">Menu Item Link</a>
			</li>
		</menu>
	</details>
	<details class="menuWrapper" name="menubar" onpointerenter={menuHover}>
		<summary class="menuName">Window</summary>
		<menu class="menu">
			<li class="menuItem">
				<button onclick={closeAll}>Close All Windows</button>
			</li>
			<li class="menuItem">
				<button onclick={resetApps}>Reset Window Positions</button>
			</li>
		</menu>
	</details>
</header>

<svelte:body onclick={dismissMenu} />

<style>
	.menubar,
	.menubarShadow {
		height: var(--menubar-height);
	}

	.menubarShadow {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		box-shadow: 0 -5px 10px 10px rgba(0, 0, 0, 0.5);
	}

	.menubar {
		--menu-item-padding: 10px;
		flex-shrink: 0;
		display: flex;
		z-index: 10000;
		background-color: white;
		padding-inline: 20px;
		-webkit-user-select: none;
		user-select: none;
	}

	.menuWrapper {
		cursor: default;
	}

	.menuName {
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1;
		padding-inline: var(--menu-item-padding);
		list-style-type: none;

		&:active,
		&:focus-visible,
		[open] & {
			@media (forced-colors: none) {
				outline: none;
				background: var(--accent-color);
				color: white;
			}
		}

		&::-webkit-details-marker {
			display: none;
		}
	}

	/* TODO fade menu when closing */
	.menu {
		position: absolute;
		padding: 4px 0;
		list-style-type: none;
		box-shadow: var(--panel-box-shadow);

		@media (forced-colors: active) {
			border: 1px solid ButtonBorder;
			/* TODO fix text color */
			background-color: Canvas;
		}

		&::before {
			/* background on separate layer to control opacity */
			position: absolute;
			top: 0;
			left: 0;
			background: white;
			width: 100%;
			height: 100%;
			content: '';
		}
	}

	.menuItem {
		position: relative;
		white-space: nowrap;

		&:hover,
		&:focus-within {
			outline: none;
			background: var(--accent-color);
			color: white;

			@media (forced-colors: active) {
				background: CanvasText;
				color: Canvas;
			}
		}

		> * {
			all: unset;
			padding-inline: 22px;
		}

		a {
			-webkit-user-drag: none;
		}
	}
</style>
