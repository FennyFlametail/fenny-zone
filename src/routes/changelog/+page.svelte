<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import setModified from '$lib/helpers/setModifiedAttachment.svelte';

	const { app } = getAppContext();
</script>

<div class="textEdit" contenteditable="true" {@attach setModified(app)}>
	<h3>2026-02-05</h3>
	<ul>
		<li>Updated character profiles</li>
	</ul>
	<h3>2026-01-24</h3>
	<ul>
		<li>Added link to UserStyles.world profile in Projects</li>
	</ul>
	<h3>2025-12-28</h3>
	<ul>
		<li>Added changelog</li>
		<li>Updated character relationships</li>
	</ul>
</div>
