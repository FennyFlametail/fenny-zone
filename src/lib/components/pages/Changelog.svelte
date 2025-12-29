<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import setModified from '$lib/helpers/setModifiedAttachment.svelte';

	const { app } = getAppContext();
</script>

<div class="textEdit" contenteditable="true" {@attach setModified(app)}>
	<h3>2025-12-28</h3>
	<ul>
		<li>Added changelog</li>
		<li>Expanded character bios</li>
	</ul>
</div>
