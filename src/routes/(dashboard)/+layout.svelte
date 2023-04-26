<script lang="ts">
	import '../../app.css';
	import { theme, extraNavOptions } from '$lib/stores';
	import Nav from '$lib/components/Menu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let navBarOpen = false;
</script>

<div data-theme={$theme} class="h-full">
	<nav class="p-4 flex justify-between sm:justify-end gap-5">
		<select class="select select-ghost max-w-xs" bind:value={$theme}>
			<option disabled selected>Pick a Theme</option>
			<option value="dark">Dark Theme</option>
			<option value="light">Light Theme</option>
			<option value="cupcake">Cupcake Theme</option>
			<option value="bumblebee">Bumblebee Theme</option>
			<option value="emerald">Emerald Theme</option>
			<option value="corporate">Corporate Theme</option>
			<option value="synthwave">Synthwave Theme</option>
			<option value="retro">Retro Theme</option>
			<option value="cyberpunk">Cyberpunk Theme</option>
			<option value="valentine">Valentine Theme</option>
			<option value="halloween">Halloween Theme</option>
			<option value="garden">Garden Theme</option>
			<option value="forest">Forest Theme</option>
			<option value="aqua">Aqua Theme</option>
			<option value="lofi">Lo-Fi Theme</option>
			<option value="pastel">Pastel Theme</option>
			<option value="fantasy">Fantasy Theme</option>
			<option value="wireframe">Wireframe Theme</option>
			<option value="black">Black Theme</option>
			<option value="luxury">Luxury Theme</option>
			<option value="dracula">Dracula Theme</option>
			<option value="cmyk">CMYK Theme</option>
			<option value="autumn">Autumn Theme</option>
			<option value="business">Business Theme</option>
			<option value="acid">Acid Theme</option>
			<option value="lemonade">Lemonade Theme</option>
			<option value="night">Night Theme</option>
			<option value="coffee">Coffee Theme</option>
			<option value="winter">Winter Theme</option>
		</select>
		<Nav bind:open={navBarOpen} name={data.user.name || data.user.email}>
			<div slot="mobile-menu">
				{#each $extraNavOptions as row}
					<button
						class="btn btn-ghost w-screen"
						on:click={() => {
							row.onClick();
							navBarOpen = false;
						}}
					>
						{row.content}
					</button>
				{/each}
			</div>
		</Nav>
	</nav>

	<main>
		<slot />
	</main>
</div>
