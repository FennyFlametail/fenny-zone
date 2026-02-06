<script lang="ts">
	import AddressBook from '$lib/components/apps/AddressBook.svelte';
	import FennyCutout from '$lib/images/icons/fenny-cutout.webp';
	import ArenCutout from '$lib/images/icons/aren-cutout.webp';
	import CephCutout from '$lib/images/icons/ceph-cutout.webp';
	import RigelCutout from '$lib/images/icons/rigel-cutout.webp';
	import NocturneCutout from '$lib/images/icons/nocturne-cutout.webp';
</script>

<AddressBook
	entries={[
		{
			appName: 'fenny',
			listIcon: FennyCutout
		},
		{
			appName: 'aren',
			listIcon: ArenCutout
		},
		{
			appName: 'ceph',
			listIcon: CephCutout
		},
		{
			appName: 'rigel',
			listIcon: RigelCutout
		},
		{
			appName: 'nocturne',
			listIcon: NocturneCutout
		}
	]}
/>
