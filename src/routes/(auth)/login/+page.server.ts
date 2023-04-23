import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signInUser, getErrorMessage } from '$lib/server/firebase/auth';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string | null;
		const password = data.get('password') as string | null;

		if (!email || !password) {
			return fail(400, {
				data: { email },
				message: 'Email and password is required'
			});
		}

		try {
			const { user, token } = await signInUser(email, password);
			cookies.set('token', token);
		} catch (exc) {
			return fail(400, { data: { email }, message: getErrorMessage(exc as Error) });
		}

		throw redirect(302, '/dashboard');
	}
} satisfies Actions;
