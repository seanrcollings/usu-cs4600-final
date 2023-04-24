<script lang="ts">
	import { slide } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import LogoutHandler from './LogoutHandler.svelte';
	import HamburgerIcon from './icons/HamburgerIcon.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';

	export let open = false;
	export let name: string | null | undefined = null;

	$: if ($navigating) open = false;
</script>

<div class="hidden sm:flex">
	<a href="/dashboard" class="btn btn-ghost">Dashboard</a>
	<!-- <LogoutHandler /> -->
	<div class="dropdown dropdown-end">
		<button class="btn btn-ghost">{name || 'Profile'}</button>
		<ul class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
			<li><a href="/logout">Logout</a></li>
		</ul>
	</div>
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
			<a href="/logout" class="btn btn-ghost w-screen rounded-none">Logout</a>
			<slot name="mobile-menu" />
		</div>
	</div>
{/if}
