<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordInput from '$lib/components/controls/PasswordInput.svelte';
	import TextInput from '$lib/components/controls/TextInput.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse md:w-1/3 w-3/4">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Sign Up</h1>
			<p class="py-6">
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
						<a href="/login" class="link link-accent link-hover">Login</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
