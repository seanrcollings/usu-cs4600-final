<script lang="ts">
	import { page } from '$app/stores';
	import { geolookupDomains } from '$lib/domains';
	import { currentPosition } from '$lib/stores';
	import type { Item } from '$lib/types/firestore';
	import TextArea from '../controls/TextArea.svelte';
	import ItemActions from './ItemActions.svelte';
	import ItemPoolClaim from './ItemPoolClaim.svelte';
	import ItemSplitClaim from './ItemSplitClaim.svelte';
	import Map from './Map.svelte';

	// Props
	export let item: Item;
	export let open: boolean;

	// Variables
	$: url = item.seller ? new URL(item.seller) : undefined;
	$: domain = url?.hostname.split('.')[1];
	$: form = $page.form;
	$: showMap = geolookupDomains[url?.hostname!] !== undefined && $currentPosition !== null;
</script>

<input type="checkbox" id="item-details-{item.id}" class="modal-toggle" bind:checked={open} />
<div class="modal">
	<div class="modal-box w-11/12 max-w-5xl">
		<div class="flex gap-10">
			{#if item.image}
				<div class="w-1/2">
					<div class="border-2 border-accent rounded-lg bg-accent min-h-full">
						<figure>
							<img
								src={item.image}
								alt={item.title}
								class="object-cover h-full w-full rounded-lg"
							/>
						</figure>
					</div>
				</div>
			{/if}
			<div class="flex flex-col items-start w-1/2">
				<div class="flex justify-between items-center w-full mb-2">
					<h2 class="text-4xl font-bold">{item.title}</h2>
					{#if item.price}
						<div
							class="tooltip tooltip-left"
							data-tip="Price Guessed from provided link. May not be accurate"
						>
							<p class="badge badge-secondary p-3 text-lg font-semibold">{item.price}</p>
						</div>
					{/if}
				</div>
				{#if item.seller}
					<a href={item.seller} class="btn btn-sm btn-primary">{domain || ''} Link</a>
				{/if}
				{#if item.description}
					<TextArea
						value={item.description}
						id="description"
						class="flex-grow self-stretch"
						disabled
						resize={false}
					/>
				{/if}
			</div>
		</div>

		{#if form?.message}
			<div class="alert alert-error mt-10">{form.message}</div>
		{/if}

		<div class="mt-10">
			<div class="flex gap-10" class:flex-col-reverse={item?.claim?.type === 'POOL'}>
				{#if showMap}
					<div class={item?.claim?.type === 'POOL' ? '' : 'w-1/2'}>
						<Map {item} />
					</div>
				{/if}
				<div class="flex-grow">
					{#if item.claim}
						{#if item.claim.type == 'SINGLE'}
							<div class="bg-base-300 rounded-lg h-24 flex items-center justify-center">
								<p>
									<span class="text-2xl">✋</span>
									Claimed by
									<span class="text-secondary">
										{item.claim.claimedBy.email}
									</span>
								</p>
							</div>
						{:else if item.claim.type === 'SPLIT'}
							<ItemSplitClaim {item} />
						{:else if item.claim.type === 'POOL'}
							<ItemPoolClaim {item} />
						{:else}
							<p>Should not be here</p>
						{/if}
					{:else}
						<ItemActions {item} />
					{/if}
				</div>
			</div>
		</div>
		<div class="modal-action">
			<label for="item-details-{item.id}" class="btn btn-secondary">Close</label>
		</div>
	</div>
</div>
