<script lang="ts">
	import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
	import type { List } from '../../lib/types/firestore';
	import EditButton from './controls/EditButton.svelte';
	import DeleteButton from './controls/DeleteButton.svelte';
	import { enhance } from '$app/forms';
	import { scale } from 'svelte/transition';
	export let list: List;
</script>

<div class="card w-72 sm:w-96 bg-base-content shadow-xl text-base-300" in:scale>
	<div class="card-body">
		<h2 class="card-title">{list.name}</h2>
		<div class="flex justify-between flex-wrap">
			<p class="text-start"><strong>On:</strong> {format(list.eventDate, 'P')}</p>
			{#if isToday(list.eventDate)}
				<div class="badge badge-primary">today!</div>
			{:else if isPast(list.eventDate)}
				<div class="badge badge-success">in the past</div>
			{:else}
				<div class="badge badge-accent">
					{formatDistanceToNow(list.eventDate, { addSuffix: true })}
				</div>
			{/if}
		</div>
		<p class="text-start"><strong>Created:</strong> {format(list.createdAt, 'P')}</p>
		<p class="text-start"><strong>Members:</strong> 0</p>
		<p class="text-start"><strong>Items:</strong> 0</p>
		<div class="card-actions justify-end">
			<td class="flex justify-end">
				<EditButton href={`dashboard/${list.id}`} class="mr-2 btn-primary" tooltip="Edit List" />
				<form action="/dashboard?/delete" method="POST" use:enhance>
					<input type="text" value={list.id} name="id" hidden />
					<DeleteButton tooltip="Delete List" class="btn-primary" />
				</form>
			</td>
		</div>
	</div>
</div>
