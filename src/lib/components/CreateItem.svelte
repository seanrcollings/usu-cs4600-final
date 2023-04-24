<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import TextInput from './controls/TextInput.svelte';
	import type { ActionData } from '../../routes/(dashboard)/dashboard/$types';
	import AddButton from './controls/AddButton.svelte';
	import TextArea from './controls/TextArea.svelte';

	export let listId: string;

	let form: ActionData | undefined;
	$: form = $page.form;
	let open: boolean = false;

	const handleForm: SubmitFunction = ({ data }) => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				open = false;
			}

			update();
		};
	};
</script>

<div class="flex items-center">
	<AddButton class="btn-primary" tooltip="Add an item" for="create-item-modal" />

	<input type="checkbox" id="create-item-modal" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Add a New Item</h3>
			{#if form?.message}
				<p class="alert alert-error mb-2 mt-2">{form.message}</p>
			{/if}

			<form use:enhance={handleForm} method="POST" action={`/dashboard/${listId}?/create`}>
				<div class="mt-2 mb-2">
					<TextInput name="title" id="name" label="Name" required />
					<TextArea name="description" id="description" label="Description" class="min-h-[9rem]" />
					<TextInput name="link" id="link" label="Link">
						<label class="label" slot="after" for="link">
							<span class="label-text-alt">
								If you provide a link, we can pull additional details from the product page
							</span>
						</label>
					</TextInput>
				</div>
				<div class="modal-action">
					<label class="btn btn-secondary" for="create-item-modal">Cancel</label>
					<button type="submit" class="btn btn-primary"> Submit</button>
				</div>
			</form>
		</div>
	</div>
</div>
