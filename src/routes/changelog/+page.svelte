<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import setModified from '$lib/helpers/setModifiedAttachment.svelte';

	const { app } = getAppContext();
</script>

<div class="textEdit" contenteditable="true" {@attach setModified(app)}>
	<h3>2026-03-19</h3>
	<ul>
		<li>Added window close animation</li>
	</ul>
	<h3>2026-03-14</h3>
	<ul>
		<li>Improved support for reduced motion & forced color accessibility options</li>
	</ul>
	<h3>2026-03-10</h3>
	<ul>
		<li>Added Trash easter egg</li>
	</ul>
	<h3>2026-03-08</h3>
	<ul>
		<li>Added support for Bluesky content warnings</li>
		<li>Fixed Bluesky feed parsing</li>
	</ul>
	<h3>2026-02-14</h3>
	<ul>
		<li>Added ad blocker warning</li>
		<li>Added window list to Window menu</li>
		<li>Made click on Bluesky title bar scroll to top</li>
	</ul>
	<h3>2026-02-10</h3>
	<ul>
		<li>Added link previews to Bluesky app</li>
	</ul>
	<h3>2026-02-09</h3>
	<ul>
		<li>Added Bluesky app</li>
	</ul>
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
