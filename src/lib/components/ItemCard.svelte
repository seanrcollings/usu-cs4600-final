<script lang="ts">
	import type { Item } from '$lib/types/firestore';
	import { fly, scale } from 'svelte/transition';
	import DeleteButton from './controls/DeleteButton.svelte';
	import EditItem from './EditItem.svelte';
	import { enhance } from '$app/forms';
	import ItemView from './members/ItemView.svelte';
	import { onMount } from 'svelte';

	export let item: Item;
	export let listId: string;
	export let mode: 'edit' | 'view' = 'view';

	$: domain = item.seller ? new URL(item.seller).hostname.split('.')[1] : undefined;

	let open = false;

	let hovering = false;
	let innerWidth: number = Infinity;
	// 640px equivalent to tailwind's `sm:` breakpoint
	$: mobile = innerWidth < 640;
	$: hovering = mobile;

	let currentPosition: GeolocationPosition | undefined | null;

	onMount(() => {
		if (mode === 'edit') return;
		window.navigator.geolocation.getCurrentPosition(
			(position) => {
				currentPosition = position;
			},
			(err) => {
				console.error(err);
				currentPosition = null;
			},
			{
				maximumAge: 300000,
				enableHighAccuracy: false
			}
		);
	});
</script>

<svelte:window bind:innerWidth />

{#if mode === 'view'}
	<ItemView {item} bind:open {currentPosition} />
{:else}
	<EditItem {listId} {item} bind:open />
{/if}

<div
	class="card w-72 h-96 bg-base-300 shadow-xl text-base-content hover:bg-base-200 transition-colors"
	in:scale={{ duration: 200 }}
	on:mouseenter={() => {
		if (mode === 'edit') hovering = true;
	}}
	on:mouseleave={() => {
		if (mode === 'edit') hovering = false;
	}}
>
	{#if item.image}
		<figure>
			<label for="item-details-{item.id}" class="hover:cursor-pointer">
				<img src={item.image} alt={item.title} />
			</label>
		</figure>
	{/if}

	{#if hovering}
		<div class="card-actions absolute right-2 top-2" transition:fly>
			<form method="POST" action="/dashboard/{listId}?/delete" use:enhance>
				<button type="submit" class="btn btn-circle btn-sm btn-secondary">
					<input type="text" value={item.id} name="id" hidden />
					<DeleteButton class="btn-sm btn-secondary" tooltip="Delete Item" />
				</button>
			</form>
		</div>
	{/if}

	<div class="card-body pb-1">
		<div class="flex justify-between items-center">
			<label for="item-details-{item.id}" class="hover:cursor-pointer hover:underline">
				<h2 class="card-title">{item.title}</h2>
			</label>
			{#if item.price}
				<div class="badge badge-secondary">{item.price}</div>
			{/if}
		</div>

		{#if item.seller}
			<div class="card-actions justify-end mt-auto mb-4">
				<a class="btn btn-primary" href={item.seller} target="_blank"
					>{domain?.toUpperCase()} Link</a
				>
			</div>
		{/if}
	</div>
</div>
