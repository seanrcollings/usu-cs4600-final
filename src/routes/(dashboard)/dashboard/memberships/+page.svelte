<script lang="ts">
	import { format, isToday, isPast, formatDistanceToNow, compareAsc } from 'date-fns';
	import type { PageData } from './$types';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';

	export let data: PageData;

	let hidePastLists = true;

	$: lists = data.lists
		.filter((list) => (hidePastLists ? !isPast(list.eventDate) || isToday(list.eventDate) : true))
		.sort((a, b) => compareAsc(a.eventDate, b.eventDate));
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
	</div>
	<div class="overflow-x-hide">
		<table class="table w-full">
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Event Date</th>
					<th class="text-right"># Members</th>
					<th class="text-right">Created On</th>
				</tr>
			</thead>
			<tbody>
				{#each lists as list, i (list.id)}
					<tr>
						<td>{i + 1}</td>
						<td>
							<a href="/dashboard/memberships/{list.owner.uid}/{list.id}" class="link">
								{list.name}
							</a>
						</td>
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
						<td class="text-right">{list.members.length + 1}</td>
						<td class="text-right"> {format(list.createdAt, 'P')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
