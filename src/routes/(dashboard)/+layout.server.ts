import { redirect } from '@sveltejs/kit';

export const load = ({ cookies, locals }) => {
	if (!cookies.get('token')) {
		throw redirect(300, '/login');
	}

	return { loggedIn: true };
};
