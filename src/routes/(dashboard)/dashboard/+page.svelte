<script lang="ts">
	import { flip } from 'svelte/animate';
	import { isPast, isToday } from 'date-fns';
	import CreateList from '$lib/components/CreateList.svelte';
	import DashboardTabs from '$lib/components/DashboardTabs.svelte';
	import type { ActionData, PageData } from './$types';
	import ToggleButton from '$lib/components/controls/ToggleButton.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import ListCard from '$lib/components/ListCard.svelte';

	export let data: PageData;
	export let form: ActionData;
	let showPast = false;

	let lists: PageData['lists'];
	$: lists = data.lists.filter((list) =>
		!showPast ? !isPast(list.eventDate) || isToday(list.eventDate) : true
	);
</script>

<div class="container m-auto">
	{#if form?.message}
		<Alert type="error" class="mb-4">{form.message}</Alert>
	{/if}

	<div class="flex justify-center sm:justify-between flex-wrap mb-4">
		<div class="flex items-center flex-col sm:flex-row">
			<DashboardTabs />
			<ToggleButton
				id="hide-past"
				label={showPast ? 'Hide Past Lists' : 'Show Past Lists'}
				class="toggle-info flex self-start mt-2 sm:self-auto sm:ml-4 sm:mt-0"
				bind:checked={showPast}
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
