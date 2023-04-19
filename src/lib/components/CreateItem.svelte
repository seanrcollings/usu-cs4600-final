<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import TextInput from './controls/TextInput.svelte';
	import DateInput from './controls/DateInput.svelte';
	import type { ActionData } from '../../routes/(dashboard)/dashboard/$types';
	import AddButton from './controls/AddButton.svelte';
	import TextArea from './controls/TextArea.svelte';

	export let listId: string;

	let form: ActionData | undefined;
	$: form = $page.form;
	let modalCheckbox: HTMLInputElement;

	const handleForm: SubmitFunction = ({ data }) => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				modalCheckbox.checked = false;
			}

			update();
		};
	};
</script>

<div>
	<AddButton
		class="btn-primary"
		tooltip="Add an item"
		on:click={() => (modalCheckbox.checked = true)}
	/>

	<input type="checkbox" id="create-list-modal" class="modal-toggle" bind:this={modalCheckbox} />
	<div class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Add a New Item</h3>
			{#if form?.message}
				<p class="alert alert-error mb-2 mt-2">{form.message}</p>
			{/if}

			<form use:enhance={handleForm} method="POST" action={`/dashboard/${listId}?/create`}>
				<div class="mt-2 mb-2">
					<TextInput name="title" id="name" label="Name" required />
					<TextArea name="description" id="description" label="Description" required />
					<TextInput name="link" id="link" label="Link" required />
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
