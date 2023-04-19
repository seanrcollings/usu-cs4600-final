<script lang="ts">
	// your script goes here

	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import type { List } from '$lib/types/firestore';
	import type { PageData } from './$types';

	export let data: PageData;

	$: lists = data.lists.map((list) => {
		return {
			...list,
			eventDate: new Date(list.eventDate).toLocaleDateString(),
			createdAt: new Date(list.createdAt).toLocaleDateString()
		};
	});

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
</script>

<div class="container m-auto">
	<div class="flex justify-between items-center mb-4">
		<DashboardTabs />
		<CreateList on:list-created={handleListCreated} />
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
				</tr>
			</thead>
			<tbody>
				{#each lists as list, i (list.id)}
					<tr>
						<td>{i + 1}</td>
						<td>{list.name}</td>
						<td>{list.eventDate}</td>
						<td>{list.createdAt}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	/* your styles go here */
</style>
