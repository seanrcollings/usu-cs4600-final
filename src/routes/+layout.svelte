<script lang="ts">
	import LogoutHandler from '$lib/components/LogoutHandler.svelte';
	import '../app.css';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	{#if data.loggedIn}
		<h1>Logged in</h1>
		<LogoutHandler />
	{:else}
		<h1>Not logged in</h1>
	{/if}
</div>

<slot />
