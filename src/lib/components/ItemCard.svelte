<script lang="ts">
	import type { Item } from '$lib/types/firestore';
	import { fly } from 'svelte/transition';
	import DeleteButton from './controls/DeleteButton.svelte';
	import EditButton from './controls/EditButton.svelte';

	export let item: Item;
	export let listId: string;

	$: domain = item.seller
		? new URL(item.seller).hostname.replace('www.', '').split('.')[0]
		: undefined;

	let hovering = false;

	const toggleHover = () => {
		hovering = !hovering;
	};
</script>

<div
	class="card w-72 h-96 bg-base-content shadow-xl text-neutral"
	on:mouseenter={toggleHover}
	on:mouseleave={toggleHover}
>
	{#if item.image}
		<figure><img src={item.image} alt={item.title} /></figure>
	{/if}

	{#if hovering}
		<div class="card-actions absolute right-2 top-2" transition:fly>
			<form method="POST" action={`/dashboard/${listId}?/edit`}>
				<button type="submit" class="btn btn-circle btn-sm btn-secondary">
					<EditButton class="btn-sm btn-secondary" tooltip="Edit Item" isButton />
				</button>
			</form>
			<form method="POST" action={`/dashboard/${listId}?/delete`}>
				<button type="submit" class="btn btn-circle btn-sm btn-secondary">
					<input type="text" value={item.id} name="id" hidden />
					<DeleteButton class="btn-sm btn-secondary" tooltip="Delete Item" />
				</button>
			</form>
		</div>
	{/if}

	<div class="card-body">
		<div class="flex justify-between">
			<h2 class="card-title">{item.title}</h2>
			{#if item.price}
				<div class="badge badge-secondary">{item.price}</div>
			{/if}
		</div>

		<p class="text-start">{item.description}</p>

		{#if item.seller}
			<div class="card-actions justify-end mt-4">
				<a class="btn btn-primary" href={item.seller} target="_blank"
					>{domain?.toUpperCase()} Link</a
				>
			</div>
		{/if}
	</div>
</div>
