import { createUser } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (!email || !password) {
			return fail(400, { data: { email }, message: 'Email and password is required' });
		}

		const user = await createUser(email, password);
		cookies.set('token', await user.getIdToken());

		return { success: true };
	}
} satisfies Actions;
