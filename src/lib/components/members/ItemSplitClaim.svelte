<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Item, SplitClaim } from '$lib/types/firestore';

	export let item: Item & { claim: SplitClaim };

	$: initialUser = item.claim.splitBy[0];
</script>

<div class="bg-base-300 rounded-lg h-24 flex items-center justify-center">
	{#if $page.data.user.uid === initialUser.uid && item.claim.splitBy.length === 1}
		<p>
			<span class="text-2xl">🪓 </span>
			You are requesting to split the price on this item. Check back in to see if anyone else wants to
			split the price with you.
		</p>
	{:else if item.claim.splitBy.length === 1}
		<form action="?/split" method="POST" use:enhance>
			<input type="text" name="itemId" value={item.id} hidden />
			<button class="btn normal-case">
				<p>
					<span>🪓 </span>
					Split price with
					<span class="text-secondary">{initialUser.email}</span>
				</p>
			</button>
		</form>
	{:else}
		<p>
			<span class="text-2xl">🪓 </span>
			<span class="text-secondary">{initialUser.email}</span> &
			<span class="text-secondary">{item.claim.splitBy[1].email} </span>
			are splitting the price on this item.
		</p>
	{/if}
</div>
