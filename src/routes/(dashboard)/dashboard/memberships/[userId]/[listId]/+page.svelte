<script lang="ts">
	import { compareAsc } from 'date-fns';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import type { PageData } from './$types';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { currentPosition } from '$lib/stores';

	export let data: PageData;
	$: list = data.list;

	onMount(() => {
		window.navigator.geolocation.getCurrentPosition(
			(position) => {
				$currentPosition = position;
			},
			(err) => {
				console.error(err);
				$currentPosition = null;
			},
			{
				maximumAge: 300000,
				enableHighAccuracy: false
			}
		);
	});
</script>

<div class="container m-auto flex flex-col">
	<div class="mx-4 pb-4 border-b border-b-accent">
		<h1 class="text-3xl sm:text-5xl font-bold self-start text-center sm:text-left">{list.name}</h1>

		<div class="flex flex-wrap items-center mt-4 gap-4 justify-center sm:justify-start">
			{#if list.owner}
				<div class="badge p-4 sm:text-lg">
					<strong>For</strong> : {list.owner.email}
				</div>
			{/if}
			<div class="badge p-4 sm:text-lg">
				<strong>On</strong>: {list.createdAt.toLocaleDateString()}
			</div>
			<div class="badge p-4 sm:text-lg">
				<strong>Created</strong> : {list.eventDate.toLocaleDateString()}
			</div>
		</div>
	</div>

	<div class="flex flex-wrap sm:mt-4 flex-col sm:flex-row items-center">
		{#each list.items.sort((a, b) => compareAsc(a.createdAt, b.createdAt)) as item (item.id)}
			<div class="m-4" animate:flip={{ duration: 200 }}>
				<ItemCard {item} listId={list.id} mode="view" />
			</div>
		{/each}
	</div>
</div>
