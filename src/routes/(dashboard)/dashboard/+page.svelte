<script lang="ts">
	import { compareAsc, formatDistanceToNow, isPast, isToday, format } from 'date-fns';
	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import DeleteButton from '$lib/components/controls/DeleteButton.svelte';
	import type { ActionData, PageData } from './$types';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';
	import EditButton from '$lib/components/controls/EditButton.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';

	export let data: PageData;
	export let form: ActionData;

	let hidePastLists = true;

	$: lists = data.lists
		.filter((list) => (hidePastLists ? !isPast(list.eventDate) || isToday(list.eventDate) : true))
		.sort((a, b) => compareAsc(a.eventDate, b.eventDate));
</script>

<div class="container m-auto">
	{#if form?.message}
		<Alert type="error" class="mb-4">{form.message}</Alert>
	{/if}

	<div class="flex justify-between items-center mb-4">
		<div class="flex items-center">
			<DashboardTabs />
			<ToggleButton
				id="hide-past"
				label="Hide Past Lists"
				class="ml-4 toggle-info"
				bind:checked={hidePastLists}
			/>
		</div>
		<div class="flex items-center">
			<CreateList />
		</div>
	</div>

	<div class="overflow-x-hide">
		<table class="table w-full">
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Event Date</th>
					<th>Created On</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each lists as list, i (list.id)}
					<tr>
						<td>{i + 1}</td>
						<td>{list.name}</td>
						<td>
							<div>
								{format(list.eventDate, 'P')}
								{#if isToday(list.eventDate)}
									<div class="badge badge-primary">today!</div>
								{:else if isPast(list.eventDate)}
									<div class="badge badge-success">in the past</div>
								{:else}
									<div class="badge badge-info">
										{formatDistanceToNow(list.eventDate, { addSuffix: true })}
									</div>
								{/if}
							</div>
						</td>
						<td>{format(list.createdAt, 'P')}</td>
						<td class="flex justify-end">
							<EditButton href={`dashboard/${list.id}`} class="mr-2" tooltip="Edit List" />
							<form action="/dashboard?/delete" method="POST" use:enhance>
								<input type="text" value={list.id} name="id" hidden />
								<DeleteButton tooltip="Delete List" />
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
