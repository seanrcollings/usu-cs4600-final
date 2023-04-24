<script lang="ts">
	import type { Item } from '$lib/types/firestore';
	import TextArea from '../controls/TextArea.svelte';

	export let item: Item;
	export let open: boolean;
	export let listId: string;
</script>

<input type="checkbox" id="item-details-{item.id}" class="modal-toggle" bind:checked={open} />
<div class="modal">
	<div class="modal-box w-11/12 max-w-5xl">
		<div class="flex gap-10">
			<div class="w-1/2">
				<div class="border-2 border-accent rounded-lg bg-accent">
					<figure>
						<img src={item.image} alt={item.title} class="object-cover h-full w-full rounded-lg" />
					</figure>
				</div>
			</div>
			<div class="w-1/2">
				<h2 class="text-4xl font-bold mb-1">{item.title}</h2>
				<a href={item.seller} class="btn btn-sm btn-primary">Link</a>
				<TextArea value={item.description} id="description" disabled resize={false} />
			</div>
		</div>
		<div class="mt-10 flex justify-center gap-5">
			<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-27">
				<span class="text-2xl">✋</span>
				Claim
			</button>
			<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-28">
				<span class="text-2xl">🪓</span>
				Split
			</button>
			<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-28">
				<span class="text-2xl">⚖️</span>
				Pool
			</button>
		</div>
		<div class="modal-action">
			<label for="item-details-{item.id}" class="btn btn-secondary">Close</label>
		</div>
	</div>
</div>
