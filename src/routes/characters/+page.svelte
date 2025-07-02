<script lang="ts">
	import Finder from '$lib/components/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';

	let selected = $state<string>();
</script>

<Finder>
	<!-- FIXME placeholder -->
	<FileIcon
		name="Fenny"
		icon="icons/textedit.png"
		selected={selected === 'Fenny'}
		onselect={() => (selected = 'Fenny')}
		onopen={() => console.debug('Fenny')}
	/>
	<FileIcon
		name="Aren"
		icon="icons/textedit.png"
		selected={selected === 'Aren'}
		onselect={() => (selected = 'Aren')}
		onopen={() => console.debug('Aren')}
	/>
	<FileIcon
		name="Ceph"
		icon="icons/textedit.png"
		selected={selected === 'Ceph'}
		onselect={() => (selected = 'Ceph')}
		onopen={() => console.debug('Ceph')}
	/>
	<FileIcon
		name="Nocturne"
		icon="icons/textedit.png"
		selected={selected === 'Nocturne'}
		onselect={() => (selected = 'Nocturne')}
		onopen={() => console.debug('Nocturne')}
	/>
</Finder>
