<script lang="ts">
	import { compareAsc } from 'date-fns';
	import CreateItem from '$lib/components/CreateItem.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import type { PageData } from './$types';
	import { flip } from 'svelte/animate';

	export let data: PageData;
	$: list = data.list!;
</script>

<div class="container m-auto flex flex-col">
	<div class="mx-4">
		<h1 class="text-3xl sm:text-5xl font-bold self-start text-center sm:text-left">{list.name}</h1>

		<div class="flex flex-wrap items-center mt-4 gap-4 justify-center sm:justify-start">
			<div class="badge p-4 sm:text-lg">
				<strong>Created</strong> : {list.eventDate.toLocaleDateString()}
			</div>
			<div class="badge p-4 sm:text-lg">
				<strong>On</strong>: {list.createdAt.toLocaleDateString()}
			</div>
		</div>
	</div>

	<div class="flex flex-wrap sm:mt-4 flex-col sm:flex-row items-center">
		{#each list.items.sort((a, b) => compareAsc(a.createdAt, b.createdAt)) as item (item.id)}
			<div class="m-4" animate:flip={{ duration: 200 }}>
				<ItemCard {item} listId={list.id} />
			</div>
		{/each}

		<CreateItem listId={list.id} />
	</div>
</div>
