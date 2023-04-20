<script lang="ts">
	import { onDestroy } from 'svelte';
	import { compareAsc, isPast, isToday } from 'date-fns';
	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import type { Action, ActionData, PageData } from './$types';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import { flip } from 'svelte/animate';
	import { extraNavOptions } from '$lib/stores';

	export let data: PageData;
	export let form: ActionData;

	let hidePastLists = true;
	let hidePastListsDisabled = false;

	$: lists = data.lists
		.filter((list) => (hidePastLists ? !isPast(list.eventDate) || isToday(list.eventDate) : true))
		.sort((a, b) => compareAsc(a.eventDate, b.eventDate));

	$: {
		const found = $extraNavOptions.find((option) => option.id === 'find-past-lists');
		const content = `${hidePastLists ? 'Show' : 'Hide'} Past Lists`;

		if (found) {
			found.content = content;
		} else {
			$extraNavOptions.push({
				id: 'find-past-lists',
				content,
				onClick: () => {
					hidePastLists = !hidePastLists;
				}
			});
		}
	}

	onDestroy(() => {
		$extraNavOptions = $extraNavOptions.filter((option) => option.id !== 'find-past-lists');
	});
</script>

<div class="container m-auto">
	{#if form?.message}
		<Alert type="error" class="mb-4">{form.message}</Alert>
	{/if}

	<div class="flex justify-center sm:justify-between flex-wrap mb-4">
		<div class="flex items-center">
			<DashboardTabs />
			<ToggleButton
				id="hide-past"
				label="Hide Past Lists"
				class="ml-4 toggle-info hidden sm:flex"
				bind:checked={hidePastLists}
			/>
		</div>
	</div>

	<div class="flex flex-wrap flex-col sm:flex-row items-center">
		{#each lists as list, i (list.id)}
			<div class="m-4" animate:flip={{ duration: 200 }}>
				<ListCard {list} />
			</div>
		{/each}

		<div class="flex items-center">
			<CreateList />
		</div>
	</div>
</div>
