<script lang="ts">
	import Finder from '$lib/components/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
</script>

<Finder>
	<!-- FIXME placeholder -->
	<FileIcon name="Fenny" icon="icons/textedit.png" onopen={() => console.debug('Fenny')} />
	<FileIcon name="Aren" icon="icons/textedit.png" onopen={() => console.debug('Aren')} />
	<FileIcon name="Ceph" icon="icons/textedit.png" onopen={() => console.debug('Ceph')} />
	<FileIcon
		name="Nocturne"
		icon="icons/textedit.png"
		alias
		onopen={() => console.debug('Nocturne')}
	/>
</Finder>
