<script lang="ts">
	import LoginHero from '$lib/components/LoginHero.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.loggedIn}
	<p>You are logged in</p>
{:else}
	<LoginHero />
{/if}
