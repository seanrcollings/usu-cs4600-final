<script lang="ts">
	import type { Item } from '$lib/types/firestore';

	export let item: Item;
</script>

<input type="checkbox" id="item-details-{item.id}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Congratulations random Internet user!</h3>
		<p class="py-4">
			You've been selected for a chance to get one year of subscription to use Wikipedia for free!
		</p>
		<div class="modal-action">
			<label for="item-details-{item.id}" class="btn">Yay!</label>
		</div>
	</div>
</div>
