import { getAuth, UserRecord } from 'firebase-admin/auth';
import { redirect } from '@sveltejs/kit';
import { FIREBASE_API_KEY } from '$env/static/private';
import { app } from './firebase';

export const auth = getAuth(app);

const codes: Record<string, string> = {
	EMAIL_EXISTS: 'auth/email-already-in-use',
	OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
	TOO_MANY_ATTEMPTS_TRY_LATER: 'auth/too-many-requests',
	INVALID_EMAIL: 'auth/invalid-email',
	INVALID_PASSWORD: 'auth/invalid-password',
	EMAIL_NOT_FOUND: 'auth/user-not-found'
};

export async function createUser(email: string, password: string): Promise<UserRecord> {
	const user = await auth.createUser({
		email,
		password,
		emailVerified: true
	});
	return user;
}

interface UserCredientials {
	user: UserRecord;
	token: string;
}

export async function signInUser(email: string, password: string): Promise<UserCredientials> {
	const res = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
		{
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
				returnSecureToken: true
			})
		}
	);
	const data = await res.json();

	if (!res.ok) {
		const code = codes[data.error.message] || 'auth/unknown';
		throw { code, message: data.error.message };
	}

	const token = await auth.verifyIdToken(data.idToken);
	const user = await auth.getUser(token.uid);
	return { user, token: data.idToken };
}

export function requiresUser(obj: { user: UserRecord | null }): UserRecord {
	if (!obj.user) {
		throw redirect(302, '/login');
	}
	return obj.user;
}

export const getErrorMessage = (error: any): string => {
	switch (error.code) {
		case 'auth/user-disabled':
			return 'User account has been disabled';
		case 'auth/user-not-found':
			return 'User account not found';
		case 'auth/email-already-in-use':
			return 'Email address already in use';
		case 'auth/invalid-email':
		case 'auth/invalid-password':
			return 'Invalid email address or password';
		default:
			return 'Something went wrong, please try again';
	}
};
