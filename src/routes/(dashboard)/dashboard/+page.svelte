<script lang="ts">
	import { compareAsc, formatDistanceToNow } from 'date-fns';
	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import DeleteButton from '$lib/components/controls/DeleteButton.svelte';
	import type { List } from '$lib/types/firestore';
	import type { PageData } from './$types';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';

	export let data: PageData;
	let hidePastLists = true;

	$: lists = data.lists
		.filter((list) => {
			if (hidePastLists) {
				return compareAsc(new Date(list.eventDate), new Date()) !== -1;
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

	// Handlers

	function handleListCreated(event: CustomEvent<{ newList: List }>) {
		const newList = event.detail.newList;

		lists = [
			...lists,
			{
				...newList,
				eventDate: new Date(newList.eventDate).toLocaleDateString(),
				createdAt: new Date(newList.createdAt).toLocaleDateString()
			}
		];
	}

	function handleDeleteList(id: string) {}

	function relativeBadge(date: Date): string {
		if (compareAsc(date, new Date()) === -1) {
			return `<div class="badge badge-success">in the past</div>`;
		}

		const distance = formatDistanceToNow(date, { addSuffix: true });
		return `<div class="badge badge-info">${distance}</div>`;
	}
</script>

<div class="container m-auto">
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
			<CreateList on:list-created={handleListCreated} />
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="table w-full">
			<!-- head -->
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Event Date</th>
					<th>Created On</th>
					<th>Actions</th>
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
						<td>
							<DeleteButton on:click={() => handleDeleteList(list.id)} tooltip="Delete List" />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	/* your styles go here */
</style>
