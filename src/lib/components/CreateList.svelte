<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import TextInput from './controls/TextInput.svelte';
	import DateInput from './controls/DateInput.svelte';
	import type { ActionData, ActionsSuccess } from '../../routes/(dashboard)/dashboard/$types';

	let form: ActionData | undefined;
	$: form = $page.form;

	let modalCheckbox: HTMLInputElement;

	const dispatch = createEventDispatcher();
	let today = new Date().toISOString().split('T')[0];

	const handleForm: SubmitFunction = ({ data }) => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				modalCheckbox.checked = false;
				dispatch('list-created', { newList: result.data });
			}

			update();
		};
	};
</script>

<div>
	<label for="create-list-modal" class="btn btn-primary">Add A List</label>

	<input type="checkbox" id="create-list-modal" class="modal-toggle" bind:this={modalCheckbox} />
	<div class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Add a New List</h3>
			{#if form?.message}
				<p class="alert alert-error mb-2 mt-2">{form.message}</p>
			{/if}

			<form use:enhance={handleForm} method="POST" action="/dashboard">
				<div class="mt-2 mb-2">
					<TextInput name="name" id="name" label="List Name" required />
					<DateInput name="eventDate" id="eventDate" label="Event Date" value={today} required />
				</div>
				<div class="modal-action">
					<button
						type="button"
						class="btn btn-secondary"
						on:click={() => (modalCheckbox.checked = false)}
					>
						Cancel
					</button>

					<button type="submit" class="btn btn-primary"> Submit</button>
				</div>
			</form>
		</div>
	</div>
</div>
