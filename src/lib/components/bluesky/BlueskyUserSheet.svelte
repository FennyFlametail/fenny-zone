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
	$effect(() => {
		if (isOpen) handle = '';
	});

	async function submitUserSheet(e: SubmitEvent) {
		e.preventDefault();
		if (handle.replace('@', '').match(getHandleRegex())) {
			// TODO loading indicator
			submit(handle);
		} else {
			// TODO better error messaging
			alert('Invalid handle');
		}
	}

	function userSheetKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<Sheet open={isOpen}>
	<form class="blueskyUserSheet" onsubmit={submitUserSheet}>
		<label class="blueskyUserSheetInputLabel">
			<span>Enter handle:</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="aqua-textinput"
				type="text"
				bind:value={handle}
				autofocus
				onkeydown={userSheetKeydown}
			/>
		</label>
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
	}

	.blueskyUserSheetInputLabel {
		display: flex;
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

	.blueskyUserSheetButtons {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		gap: 15px;
	}
</style>
