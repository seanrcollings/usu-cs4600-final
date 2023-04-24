<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import TextInput from './controls/TextInput.svelte';
	import type { ActionData } from '../../routes/(dashboard)/dashboard/$types';
	import TextArea from './controls/TextArea.svelte';
	import type { Item } from '$lib/types/firestore';

	export let listId: string;
	export let item: Item;
	export let open: boolean;

	let form: ActionData | undefined;
	$: form = $page.form;

	const handleForm: SubmitFunction = ({ data }) => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				open = false;
			}

			update({ reset: false });
		};
	};
</script>

<input type="checkbox" id="item-details-{item.id}" class="modal-toggle" bind:checked={open} />
<div class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Edit This Item</h3>
		{#if form?.message}
			<p class="alert alert-error mb-2 mt-2">{form.message}</p>
		{/if}

		<form
			use:enhance={handleForm}
			method="POST"
			action={`/dashboard/${listId}?/update`}
			use:enhance
		>
			<div class="mt-2 mb-2">
				<input type="text" value={item.id} name="id" hidden />
				<TextInput name="title" id="name" label="Name" required bind:value={item.title} />
				<TextArea
					name="description"
					id="description"
					label="Description"
					required
					bind:value={item.description}
				/>
				<TextInput name="link" id="link" label="Link" required bind:value={item.seller}>
					<label class="label" slot="after" for="link">
						<span class="label-text-alt">
							If you provide a link, we can pull additional details from the product page
						</span>
					</label>
				</TextInput>
			</div>
			<div class="modal-action">
				<label for="item-details-{item.id}" class="btn btn-secondary">Close </label>

				<button type="submit" class="btn btn-primary">Save</button>
			</div>
		</form>
	</div>
</div>
