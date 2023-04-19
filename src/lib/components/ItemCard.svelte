<script lang="ts">
	import type { Item } from '$lib/types/firestore';

	export let item: Item;
</script>

<div class="card w-72 bg-base-content shadow-xl text-neutral">
	<figure><img src={item.image} alt={item.title} /></figure>
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
				<a class="btn btn-primary" href="http://www.google.com" target="_blank"
					>{item.seller} Link</a
				>
			</div>
		{/if}
	</div>
</div>
