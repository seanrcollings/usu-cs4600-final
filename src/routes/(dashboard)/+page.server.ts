import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
	const { loggedIn } = await parent();
	if (loggedIn) {
		throw redirect(302, '/dashboard');
	}
}
