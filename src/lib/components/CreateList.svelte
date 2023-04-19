<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import TextInput from './controls/TextInput.svelte';
	import DateInput from './controls/DateInput.svelte';
	import type { ActionData } from '../../routes/(dashboard)/dashboard/$types';
	import { parse } from 'date-fns';

	let form: ActionData | undefined;
	$: form = $page.form;

	let open: boolean = false;

	let today = new Date().toISOString().split('T')[0];

	const handleForm: SubmitFunction = ({ data }) => {
		const date = data.get('eventDate') as string;
		const withTimezone = parse(date, 'yyyy-MM-dd', new Date());
		data.set('eventDate', withTimezone.toISOString());

		return ({ result, update }) => {
			if (result.type === 'success') {
				open = false;
			}

			update();
		};
	};
</script>

<div>
	<label for="create-list-modal" class="btn btn-primary">Add A List</label>

	<input type="checkbox" id="create-list-modal" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Add a New List</h3>
			{#if form?.message}
				<p class="alert alert-error mb-2 mt-2">{form.message}</p>
			{/if}

			<form use:enhance={handleForm} method="POST" action="/dashboard?/create">
				<div class="mt-2 mb-2">
					<TextInput name="name" id="name" label="List Name" required />
					<DateInput name="eventDate" id="eventDate" label="Event Date" value={today} required />
				</div>
				<div class="modal-action">
					<button type="button" class="btn btn-secondary" on:click={() => (open = false)}>
						Cancel
					</button>

					<button type="submit" class="btn btn-primary"> Submit</button>
				</div>
			</form>
		</div>
	</div>
</div>
