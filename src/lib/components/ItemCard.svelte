<script lang="ts">
	import type { Item } from '$lib/types/firestore';

	export let item: Item;

	$: domain = item.seller
		? new URL(item.seller).hostname.replace('www.', '').split('.')[0]
		: undefined;
</script>

<div class="card w-72 h-96 bg-base-content shadow-xl text-neutral">
	{#if item.image}
		<figure><img src={item.image} alt={item.title} /></figure>
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
