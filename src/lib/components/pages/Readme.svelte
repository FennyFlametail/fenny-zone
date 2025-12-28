<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import textEditAttachment from '$lib/helpers/textEditAttachment.svelte';
	import FennyWave from '$lib/images/fenny-wave.webp';

	const { app } = getAppContext();
</script>

<pre
	{@attach textEditAttachment(app, {
		plaintext: true
	})}>
Hi, I'm Fenny! Welcome to my silly corner of the internet 🦊❤️

<img src={FennyWave} alt="My fox Fenny, waving at you!" width="256px" height="256px" />
This site is a work-in-progress, but feel free to poke around! You can find me elsewhere at the links on the right. (Hint: check out the icons at the bottom of the screen)

Desktop image by <a
		href="https://www.furaffinity.net/user/WickedForster/"
		target="_blank"
		contenteditable="false">WickedForster</a
	>
Googly eyes inspired by <a
		href="https://sindresorhus.com/googly-eyes"
		target="_blank"
		contenteditable="false">Sindre Sorhus</a
	>
Chozo font by <a
		href="https://old.reddit.com/r/Metroid/comments/qm2v3c/i_have_made_a_fully_functional_automated/"
		target="_blank"
		contenteditable="false">Wolfeur</a
	>
</pre>
