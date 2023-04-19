<script lang="ts">
	import CreateItem from '$lib/components/CreateItem.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import AddButton from '$lib/components/controls/AddButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: list = data.list!;

	$: console.log(list);
</script>

<div class="container m-auto text-center flex flex-col items-center">
	<h1 class="text-xl">{list.name}</h1>

	<div class="flex justify-between items-center mt-4 w-80">
		<div class="badge">Created: {list.eventDate.toLocaleDateString()}</div>
		<div class="badge">On: {list.createdAt.toLocaleDateString()}</div>
	</div>

	<div class="flex flex-wrap mt-4">
		{#each list.items as item}
			<div class="m-4">
				<ItemCard {item} />
			</div>
		{/each}
	</div>

	<div class="mt-8">
		<CreateItem listId={list.id} />
	</div>
</div>
