<script lang="ts">
	import mapboxgl, { Marker } from 'mapbox-gl';
	import geocodingClient from '@mapbox/mapbox-sdk/services/geocoding';
	import { page } from '$app/stores';
	import { geolookupDomains } from '$lib/domains';
	import type { Item } from '$lib/types/firestore';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import TextArea from '../controls/TextArea.svelte';
	import ItemActions from './ItemActions.svelte';
	import ItemPoolClaim from './ItemPoolClaim.svelte';
	import ItemSplitClaim from './ItemSplitClaim.svelte';

	import './ItemView.css';
	import 'mapbox-gl/dist/mapbox-gl.css';

	// Props

	export let item: Item;
	export let open: boolean;
	export let currentPosition: GeolocationPosition | undefined | null;

	// Variables

	$: url = item.seller ? new URL(item.seller) : undefined;
	$: domain = url?.hostname.split('.')[1];
	$: showMap = geolookupDomains[url?.hostname!] !== undefined;
	$: form = $page.form;
	// Services

	const geocodingService = geocodingClient({ accessToken: PUBLIC_MAPBOX_API_KEY });

	// Functions

	const addMarker = (map: mapboxgl.Map, location: { lon: number; lat: number }) => {
		const marker = new Marker({ anchor: 'bottom' });
		marker.setLngLat(location);
		marker.addTo(map);
	};

	const constructMap = async () => {
		if (!currentPosition) return;
		const { longitude, latitude } = currentPosition.coords;

		const map = new mapboxgl.Map({
			accessToken: PUBLIC_MAPBOX_API_KEY,
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [longitude, latitude],
			zoom: 11.25
		});

		const searchResult = await geocodingService
			.forwardGeocode({
				query: geolookupDomains[url?.hostname!] ?? '',
				proximity: [longitude, latitude]
			})
			.send();

		if (searchResult.body.features) {
			searchResult.body.features.forEach((feature) => {
				const location = { lon: feature.center[0], lat: feature.center[1] };
				addMarker(map, location);
			});
		}
	};

	$: if (showMap && currentPosition) constructMap();
</script>

<input type="checkbox" id="item-details-{item.id}" class="modal-toggle" bind:checked={open} />
<div class="modal">
	<div class="modal-box w-11/12 max-w-5xl">
		<div class="flex gap-10">
			<div class="w-1/2">
				<div class="border-2 border-accent rounded-lg bg-accent min-h-full">
					{#if item.image}
						<figure>
							<img
								src={item.image}
								alt={item.title}
								class="object-cover h-full w-full rounded-lg"
							/>
						</figure>
					{/if}
				</div>
			</div>
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
			<div class="flex gap-10">
				{#if showMap}
					<div class="w-1/2 border-2 border-accent rounded-lg h-64">
						{#if currentPosition === undefined}
							<p class="text-center">
								<button class="btn btn-ghost loading"> Loading map</button>
							</p>
						{:else if currentPosition === null}
							<p class="text-center p-3 text-sm font-semibold">
								<span class="m-2">LOCATION NOT AVAILABLE</span>
							</p>
						{/if}
						<div id="map" class="h-full w-full" />
					</div>
				{/if}
				<div class="w-1/2 flex-grow">
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
						{:else if item.claim.type == 'SPLIT'}
							<ItemSplitClaim {item} />
						{:else if item.claim.type == 'POOL'}
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
