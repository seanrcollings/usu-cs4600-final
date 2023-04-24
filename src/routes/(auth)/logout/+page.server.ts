import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export function load({ cookies }) {
	cookies.delete('token');
	throw redirect(302, '/');
}
