<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import TextInput from './controls/TextInput.svelte';
	import type { ActionData } from '../../routes/(dashboard)/dashboard/[listId]/$types';
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
	<AddButton class="btn-primary" tooltip="Invite People" for="invite-modal" />

	<input type="checkbox" id="invite-modal" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Invite People</h3>
			{#if form?.message}
				<p class="alert alert-error mb-2 mt-2">{form.message}</p>
			{/if}

			<form use:enhance={handleForm} method="POST" action={`/dashboard/${listId}?/invite`}>
				<div class="mt-2 mb-2">
					<TextArea name="contacts" id="contacts" label="Contacts" required>
						<label slot="after" for="contacts" class="label">
							<span class="label-text-alt">Comma-seperated list of emails</span>
						</label>
					</TextArea>
				</div>
				<p class="text-warning">
					Warning: once you invite people to the list, you will no longer be able to modify it!
				</p>
				<div class="modal-action">
					<label for="invite-modal" class="btn btn-secondary">Cancel</label>

					<button type="submit" class="btn btn-primary"> Submit</button>
				</div>
			</form>
		</div>
	</div>
</div>
