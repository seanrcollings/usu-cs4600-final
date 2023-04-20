<script lang="ts">
	import '../../app.css';
	import LogoutHandler from '$lib/components/LogoutHandler.svelte';
	import { theme } from '$lib/stores';
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
		<LogoutHandler />
	</nav>

	<main>
		<slot />
	</main>
</div>
