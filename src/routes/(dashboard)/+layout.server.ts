import { requiresUser } from '$lib/server/firebase/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies, locals }) => {
	if (!cookies.get('token')) {
		throw redirect(300, '/login');
	}

	const user = requiresUser(locals);

	return {
		user: { uid: user.uid, email: user.email, name: user.displayName }
	};
};
