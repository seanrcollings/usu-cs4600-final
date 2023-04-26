<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Item } from '$lib/types/firestore';

	export let item: Item;
</script>

<div class="flex justify-center gap-5">
	<form action="?/claim" method="POST" use:enhance>
		<input type="text" name="type" value="SINGLE" hidden />
		<input type="text" name="itemId" value={item.id} hidden />
		<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-27">
			<span class="text-2xl">✋</span>
			Claim
		</button>
	</form>
	<form action="?/claim" method="POST" use:enhance>
		<input type="text" name="type" value="SPLIT" hidden />
		<input type="text" name="itemId" value={item.id} hidden />
		<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-28">
			<span class="text-2xl">🪓</span>
			Split
		</button>
	</form>
	<form action="?/claim" method="POST" use:enhance>
		<input type="text" name="type" value="POOL" hidden />
		<input type="text" name="itemId" value={item.id} hidden />
		<input type="text" name="itemPrice" value={item.price} hidden />
		<button class="btn btn-lg btn-ghost border border-accent flex-col gap-2 h-24 w-28">
			<span class="text-2xl">⚖️</span>
			Pool
		</button>
	</form>
</div>
