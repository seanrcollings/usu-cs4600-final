<script lang="ts">
	import { page } from '$app/stores';
	import PasswordInput from '$lib/components/controls/PasswordInput.svelte';
	import TextInput from '$lib/components/controls/TextInput.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	const redirect = $page.url.searchParams.get('redirectTo');
</script>

<svelte:head>
	<title>Sign Up | Gift Giver</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
	<div class="container hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Sign Up</h1>
			<p class="py-6 max-w-sm">
				<strong> Gift Giving Made Easy. </strong>
				Create your account to start making lists and sharing them with your friends and family.
			</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
			<div class="card-body">
				{#if form?.message}
					<p class="alert alert-error">{form.message}</p>
				{/if}

				<form action="/signup" method="POST" class="flex flex-col gap-4">
					<input type="text" value={$page.url.searchParams.get('redirectTo')} hidden />
					<TextInput
						name="email"
						id="email"
						required
						value={form?.data.email ?? ''}
						label="Email"
					/>
					<PasswordInput name="password" id="password" required label="Password" />
					<button class="btn btn-primary">Create Account</button>
					<div class="ml-auto">
						Already have an Account?
						{#if redirect}
							<a href="/login?redirectTo={redirect}" class="link link-accent link-hover">Login</a>
						{:else}
							<a href="/login" class="link link-accent link-hover">Login</a>
						{/if}
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
