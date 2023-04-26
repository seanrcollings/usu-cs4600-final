<script lang="ts">
	import mapboxgl, { Marker } from 'mapbox-gl';
	import geocodingClient from '@mapbox/mapbox-sdk/services/geocoding';
	import { geolookupDomains } from '$lib/domains';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import type { Item } from '$lib/types/firestore';
	import { currentPosition } from '$lib/stores';
	import 'mapbox-gl/dist/mapbox-gl.css';

	export let item: Item;

	$: url = item.seller ? new URL(item.seller) : undefined;

	// Services

	const geocodingService = geocodingClient({ accessToken: PUBLIC_MAPBOX_API_KEY });

	// Functions

	const addMarker = (map: mapboxgl.Map, location: { lon: number; lat: number }) => {
		const marker = new Marker({ anchor: 'bottom' });
		marker.setLngLat(location);
		marker.addTo(map);
	};

	const constructMap = async () => {
		if (!$currentPosition) return;
		const { longitude, latitude } = $currentPosition.coords;

		const map = new mapboxgl.Map({
			accessToken: PUBLIC_MAPBOX_API_KEY,
			container: `map-${item.id}`,
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

	$: if ($currentPosition) constructMap();
</script>

<div class="border-2 border-accent rounded-lg h-64">
	{#if $currentPosition === undefined}
		<div class="h-full flex items-center justify-center">
			<p>
				<button class="btn btn-ghost loading"> Loading map</button>
			</p>
		</div>
	{:else if $currentPosition === null}
		<p class="text-center p-3 text-sm font-semibold">
			<span class="m-2">LOCATION NOT AVAILABLE</span>
		</p>
	{/if}
	<div id="map-{item.id}" class="map h-full w-full" />
</div>

<style>
	.map .mapboxgl-canvas-container canvas {
		border-radius: 0.5rem;
		width: 464px !important;
	}
</style>
