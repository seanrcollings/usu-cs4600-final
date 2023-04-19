<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import TextInput from '$lib/components/controls/TextInput.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

{#if form?.error}
	<Alert type="error">
		{form?.error}
	</Alert>
{/if}

<form action="" method="POST" class="container mx-auto" use:enhance>
	<TextInput name="url" label="Url" id="url" />
	<button class="btn btn-primary">Start Job</button>
</form>
