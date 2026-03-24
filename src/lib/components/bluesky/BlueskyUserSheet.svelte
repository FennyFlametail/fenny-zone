<script lang="ts">
	import Sheet from '$lib/components/Sheet.svelte';
	import getHandleRegex from '$lib/helpers/blueskyHandleRegex';

	const {
		isOpen,
		close,
		submit
	}: {
		isOpen: boolean;
		close: () => void;
		submit: (handle: string) => void;
	} = $props();

	let handle = $state<string>('');
	let showWarning = $state(false);
	$effect(() => {
		if (isOpen) {
			handle = '';
			showWarning = false;
		}
	});

	async function submitUserSheet(e: SubmitEvent) {
		e.preventDefault();
		if (handle.replace('@', '').match(getHandleRegex())) {
			submit(handle);
		} else {
			showWarning = true;
		}
	}

	function userSheetKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<Sheet {isOpen}>
	<form class="blueskyUserSheet" onsubmit={submitUserSheet}>
		<label class="blueskyUserSheetInputRow">
			<span>Enter handle:</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="aqua-textinput"
				type="text"
				bind:value={handle}
				onkeydown={userSheetKeydown}
				autofocus
				autocapitalize="off"
				autocorrect="off"
				spellcheck="false"
				writingsuggestions="false"
				inputmode="url"
				enterkeyhint="go"
			/>
		</label>
		<p class="blueskyUserSheetWarning" hidden={!showWarning}>Invalid handle.</p>
		<div class="blueskyUserSheetButtons">
			<button type="button" class="aqua-button" onclick={close} onkeydown={userSheetKeydown}
				>Cancel</button
			>
			<button
				type="submit"
				class="aqua-button primary"
				disabled={!handle}
				onkeydown={userSheetKeydown}>Go to User</button
			>
		</div>
	</form>
</Sheet>

<style>
	.blueskyUserSheet {
		width: 300px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.blueskyUserSheetInputRow {
		display: flex;
		align-items: center;
		gap: 10px;

		span {
			flex-shrink: 0;
			-webkit-user-select: none;
			user-select: none;
		}
		input {
			width: 100%;
			&:user-invalid {
				background-color: pink;
			}
		}
	}

	.blueskyUserSheetWarning {
		color: var(--text-secondary);
		-webkit-user-select: none;
		user-select: none;
		margin-block: -10px;
	}

	.blueskyUserSheetButtons {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
	}
</style>
