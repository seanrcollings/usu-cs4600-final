<script>
	import { slide } from 'svelte/transition';
	import LogoutHandler from './LogoutHandler.svelte';
	import HamburgerIcon from './icons/HamburgerIcon.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';

	export let open = false;
</script>

<div class="hidden sm:flex">
	<a href="/dashboard" class="btn btn-ghost">Dashboard</a>
	<LogoutHandler />
</div>

<div class="block sm:hidden">
	<label class="btn btn-circle btn-ghost swap swap-rotate">
		<input type="checkbox" bind:checked={open} />
		<HamburgerIcon class="swap-off  fill-current" />
		<CloseIcon class="swap-on fill-current" />
	</label>
</div>

{#if open}
	<div
		class="menu bg-base-300 w-screen absolute right-0 top-20 z-10"
		transition:slide={{ duration: 200 }}
	>
		<div class="menu-content">
			<a href="/dashboard" class="btn btn-ghost w-screen rounded-none">Dashboard</a>
			<LogoutHandler class="w-screen rounded-none" />
			<slot name="mobile-menu" />
		</div>
	</div>
{/if}
