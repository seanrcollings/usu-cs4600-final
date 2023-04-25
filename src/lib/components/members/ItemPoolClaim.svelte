<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { Item, PoolClaim } from '$lib/types/firestore';
	import NumberInput from '../controls/NumberInput.svelte';
	import { enhance } from '$app/forms';

	export let item: Item & { claim: PoolClaim };

	$: current = item.claim.pool.reduce((acc, curr) => acc + curr.amount, 0);

	const progress = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});

	$: progress.set(current);
</script>

<div class="bg-base-200 rounded-lg h-full p-5">
	<h1 class="text-xl">⚖️ Pooling</h1>
	<div class="flex items-center gap-20">
		<div class="w-full">
			<div class="flex justify-between">
				<span class="text-xl">$0</span>
				<span class="text-xl">${item.claim.price}</span>
			</div>
			<div class="tooltip w-full" data-tip="At: ${current}">
				<progress class="progress progress-primary" value={$progress} max={item.claim.price} />
			</div>
		</div>
		<form
			class="flex flex-col gap-5"
			action="?/pool"
			method="POST"
			use:enhance={() =>
				({ update }) =>
					update({ reset: false })}
		>
			<input type="text" name="itemId" value={item.id} hidden readonly />
			<NumberInput id="amount" name="amount" placeholder="5.40" required />
			<button class="btn btn-primary">Contribute</button>
		</form>
	</div>
</div>
