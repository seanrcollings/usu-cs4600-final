import { auth } from '$lib/server/firebase/auth';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('token');
	if (token) {
		try {
			const { uid } = await auth.verifyIdToken(token);
			const user = await auth.getUser(uid);
			event.locals.user = user;
		} catch {
			event.cookies.delete('token');
			event.locals.user = null;
		}
	}

	const response = await resolve(event);
	return response;
}
