import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: ({ cookies }) => {
		cookies.delete('token');

		throw redirect(302, '/');
	}
} satisfies Actions;
