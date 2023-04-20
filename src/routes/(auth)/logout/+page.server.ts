import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signOutUser } from '$lib/auth';

export const actions = {
	default: ({ cookies }) => {
		signOutUser();
		cookies.delete('token');

		throw redirect(302, '/');
	}
} satisfies Actions;
