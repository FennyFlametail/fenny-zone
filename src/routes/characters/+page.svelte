<script lang="ts">
	import Finder from '$lib/components/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
</script>

<Finder>
	<FileIcon name="Fenny" icon="icons/fenny.png" onopen={() => console.debug('Fenny')} />
	<FileIcon name="Aren" icon="icons/aren.png" onopen={() => console.debug('Aren')} />
	<FileIcon name="Ceph" icon="icons/ceph.png" onopen={() => console.debug('Ceph')} />
	<FileIcon name="Nocturne" icon="icons/nocturne.png" onopen={() => console.debug('Nocturne')} />
</Finder>
