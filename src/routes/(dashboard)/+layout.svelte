<script lang="ts">
	import '../../app.css';
	import { theme, extraNavOptions } from '$lib/stores';
	import Nav from '$lib/components/Menu.svelte';

	let navBarOpen = false;
</script>

<div data-theme={$theme} class="h-full">
	<nav class="p-4 flex justify-between sm:justify-end gap-5">
		<select class="select select-ghost max-w-xs" bind:value={$theme}>
			<option disabled selected>Pick a Theme</option>
			<option value="dark">Dark Theme</option>
			<option value="light">Light Theme</option>
			<option value="dracula">Dracula Theme</option>
			<option value="business">Business Theme</option>
		</select>
		<Nav bind:open={navBarOpen}>
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
