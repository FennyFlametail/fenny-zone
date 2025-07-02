<script lang="ts">
	import TextEdit from '$lib/components/TextEdit.svelte';
	// TODO actual readme text
	let text = $state(
		'Aliqua id excepteur cillum esse eiusmod dolor veniam incididunt aute laborum sit proident. Proident ut consectetur ipsum est cillum anim duis in proident tempor in mollit nostrud. Fugiat ut nisi laborum anim mollit laborum ex consequat cillum culpa labore exercitation aliquip. Id aliquip irure sunt id ex tempor deserunt sit adipisicing et.'
	);
</script>

<TextEdit bind:text />
