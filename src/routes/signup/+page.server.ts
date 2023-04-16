import { createUser, getErrorMessage } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { FirebaseError } from 'firebase/app';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (!email || !password) {
			return fail(400, { data: { email }, message: 'Email and password is required' });
		}

		try {
			const user = await createUser(email, password);
			cookies.set('token', await user.getIdToken());
		} catch (exc) {
			return fail(400, { data: { email }, message: getErrorMessage(exc as Error) });
		}

		throw redirect(302, '/');
	}
} satisfies Actions;
