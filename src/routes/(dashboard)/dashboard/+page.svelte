<script lang="ts">
	import { compareAsc, formatDistanceToNow, isPast } from 'date-fns';
	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import DeleteButton from '$lib/components/controls/DeleteButton.svelte';
	import type { ActionData, PageData } from './$types';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';

	export let data: PageData;
	export let form: ActionData;

	let hidePastLists = true;

	$: lists = data.lists
		.filter((list) => {
			if (hidePastLists) {
				return !isPast(new Date(list.eventDate));
			}

			return true;
		})
		.map((list) => {
			return {
				...list,
				eventDate: new Date(list.eventDate).toLocaleDateString(),
				createdAt: new Date(list.createdAt).toLocaleDateString()
			};
		})
		.sort((a, b) => compareAsc(new Date(a.eventDate), new Date(b.eventDate)));

	function relativeBadge(date: Date): string {
		if (isPast(date)) {
			return `<div class="badge badge-success">in the past</div>`;
		}

		const distance = formatDistanceToNow(date, { addSuffix: true });
		return `<div class="badge badge-info">${distance}</div>`;
	}
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

	<div class="overflow-x-auto">
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
								{list.eventDate}
								{@html relativeBadge(new Date(list.eventDate))}
							</div>
						</td>
						<td>{list.createdAt}</td>
						<td class="text-right">
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
