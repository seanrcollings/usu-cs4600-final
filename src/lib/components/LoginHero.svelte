<script lang="ts">
	import { page } from '$app/stores';
	import PasswordInput from '$lib/components/controls/PasswordInput.svelte';
	import TextInput from '$lib/components/controls/TextInput.svelte';
	import type { ActionData } from '../../routes/(auth)/login/$types';

	export let form: ActionData | undefined = undefined;
	$: form = $page.form;

	const redirect = $page.url.searchParams.get('redirectTo');
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="container hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				<strong> Gift Giving Made Easy. </strong>
				Login in now to get started.
			</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
			<div class="card-body">
				{#if form?.message}
					<p class="alert alert-error">{form.message}</p>
				{/if}

				<form action="/login" method="POST" class="flex flex-col gap-4">
					<input type="text" value={$page.url.searchParams.get('redirectTo')} hidden />
					<TextInput
						name="email"
						id="email"
						required
						value={form?.data.email ?? ''}
						label="Email"
					/>
					<PasswordInput name="password" id="password" required label="Password" />
					<button class="btn btn-primary">Login</button>
					<div class="ml-auto">
						Don't have an Account?
						{#if redirect}
							<a href="/signup?redirectTo={redirect}" class="link link-accent link-hover">Sign Up</a
							>
						{:else}
							<a href="/signup" class="link link-accent link-hover">Sign Up</a>
						{/if}
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
