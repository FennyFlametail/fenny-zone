<script>
	import preferences from '$lib/preferences.svelte';
</script>

<div class="appearancePrefs">
	<label class="aqua-checkbox-label">
		<input type="checkbox" class="aqua-checkbox" bind:checked={preferences.duoLayout} />
		<span>Use iPhone Duo layout</span>
	</label>
</div>

<style>
	.appearancePrefs {
		padding: 35px 100px;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 10px;
	}
</style>
