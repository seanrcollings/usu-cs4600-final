<script lang="ts">
	import '../../app.css';
	import type { PageData } from './$types';
	import LogoutHandler from '$lib/components/LogoutHandler.svelte';

	export let data: PageData;
</script>

<nav class="p-4">
	{#if data.loggedIn}
		<LogoutHandler />
	{:else}
		<h1>Not logged in</h1>
	{/if}
</nav>

<main class="">
	<slot />
</main>
