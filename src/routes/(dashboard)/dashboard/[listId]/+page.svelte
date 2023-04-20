<script lang="ts">
	import { compareAsc } from 'date-fns';
	import CreateItem from '$lib/components/CreateItem.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: list = data.list!;
</script>

<div class="container m-auto flex flex-col">
	<div class="mx-4">
		<h1 class="text-5xl font-bold self-start text-left">{list.name}</h1>

		<div class="flex items-center mt-4 gap-4">
			<div class="badge p-4 text-lg">
				<strong>Created</strong> : {list.eventDate.toLocaleDateString()}
			</div>
			<div class="badge p-4 text-lg">
				<strong>On</strong>: {list.createdAt.toLocaleDateString()}
			</div>
		</div>
	</div>

	<div class="flex flex-wrap mt-4">
		{#each list.items.sort((a, b) => compareAsc(a.createdAt, b.createdAt)) as item}
			<div class="m-4">
				<ItemCard {item} listId={list.id} />
			</div>
		{/each}

		<CreateItem listId={list.id} />
	</div>
</div>
