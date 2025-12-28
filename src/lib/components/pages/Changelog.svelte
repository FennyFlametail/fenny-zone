<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import textEditAttachment from '$lib/helpers/textEditAttachment.svelte';

	const { app } = getAppContext();
</script>

<div {@attach textEditAttachment(app)}>
	<h3>2025-12-28</h3>
	<ul>
		<li>Added changelog</li>
	</ul>
</div>
