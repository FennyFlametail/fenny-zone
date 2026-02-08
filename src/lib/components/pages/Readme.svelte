<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import setModified from '$lib/helpers/setModifiedAttachment.svelte';
	import FennyWave from '$lib/images/fenny-wave.webp';

	const { app } = getAppContext();
</script>

<pre class="textEdit plaintext" contenteditable="true" {@attach setModified(app)}>
Hi, I'm Fenny! Welcome to my silly corner of the internet 🦊❤️

<img src={FennyWave} alt="My fox Fenny, waving at you!" width="256px" height="256px" />
This site is a work-in-progress, but feel free to poke around! Check out the icons at the bottom, or find me elsewhere at the links on the right!

Waving sticker by <a
		href="https://www.furaffinity.net/user/ponacho"
		target="_blank"
		contenteditable="false">Ponacho</a
	>
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
