<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';

	const message: string = $page.error?.message || 'Whoops, something went wrong';
</script>

<svelte:head>
	<title>{$page.status} | Gift Giver</title>
</svelte:head>

<main class="bg-white text-slate-600">
	<h1 class="text-3xl mb-2 font-bold">{$page.status}: {message}</h1>

	<p>
		<a href="/" class="link link-primary link-hover">Go back to the homepage</a>
	</p>

	<p>Or play some Snake to take your mind off things</p>

	<iframe src="https://seanrcollings.github.io/wasm-snake/" frameborder="0" title="Snake" />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	iframe {
		width: 100%;
		height: 770px;
	}
</style>
