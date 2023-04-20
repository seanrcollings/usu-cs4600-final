<script>
	import { page } from '$app/stores';
</script>

<div class="tabs justify-center">
	<a
		class="tab tab-bordered text-xl"
		class:tab-active={$page.route.id === '/(dashboard)/dashboard'}
		href="/dashboard"
	>
		Your Lists
	</a>
	<a
		class="tab tab-bordered text-xl"
		class:tab-active={$page.route.id === '/(dashboard)/memberships'}
		href="/dashboard/memberships"
	>
		Your Memberships
	</a>
</div>
