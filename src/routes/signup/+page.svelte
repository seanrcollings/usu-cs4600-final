<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

{#if form?.message}
	<p class="bg-red-400 p-2 text-white">{form.message}</p>
{/if}
<form action="/signup" method="POST" class="flex flex-col" use:enhance>
	<label for="email">Email</label>
	<input
		type="text"
		name="email"
		id="email"
		required
		class="border-solid border-black border-2"
		value={form?.data.email ?? ''}
	/>
	<label for="password">Password</label>
	<input
		type="password"
		name="password"
		id="password"
		required
		class="border-solid border-black border-2"
	/>
	<button>Submit</button>
</form>

<style>
</style>
