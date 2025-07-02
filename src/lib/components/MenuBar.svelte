<div class="menubarShadow"></div>

<header class="menubar">
	<details class="menuWrapper" name="menubar">
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
	<details class="menuWrapper" name="menubar">
		<summary class="menuName">Menu 1</summary>
		<menu class="menu">
			<li class="menuItem">
				<button>Menu Item Button</button>
			</li>
			<li class="menuItem">
				<a class="menuItem" href="/" draggable="false">Menu Item Link</a>
			</li>
		</menu>
	</details>
	<details class="menuWrapper" name="menubar">
		<summary class="menuName">Menu 2</summary>
		<menu class="menu">
			<li class="menuItem">
				<button>Menu Item Button</button>
			</li>
			<li class="menuItem">
				<a class="menuItem" href="/" draggable="false">Menu Item Link</a>
			</li>
		</menu>
	</details>
</header>

<style>
	.menubar,
	.menubarShadow {
		height: 30px;
	}

	.menubarShadow {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
	}

	.menubar {
		--menu-item-padding: 10px;
		display: flex;
		z-index: 10000;
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

		:where(&:active, &:focus-visible, [open] &) {
			@media (forced-colors: none) {
				outline: none;
				background: black;
				color: white;
			}
		}

		&::-webkit-details-marker {
			display: none;
		}
	}

	.menu {
		position: absolute;
		padding: 4px 0;
		list-style-type: none;

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

		:where(&:hover, &:focus-within) {
			outline: none;
			background: black;
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
