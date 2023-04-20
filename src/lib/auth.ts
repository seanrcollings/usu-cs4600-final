import {
	getAuth,
	createUserWithEmailAndPassword,
	type User,
	signInWithEmailAndPassword
} from 'firebase/auth';
import { app } from './firebase';
import { FirebaseError } from 'firebase/app';
import { redirect } from '@sveltejs/kit';

const auth = getAuth(app);

// Populate the auth.currentUser object on page load
auth.onAuthStateChanged((user) => {});

export async function createUser(email: string, password: string): Promise<User> {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	return user;
}

export async function signInUser(email: string, password: string): Promise<User> {
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	return user;
}

export function getCurrentUser(): User {
	const user = auth.currentUser;
	if (!user) throw redirect(302, '/login');
	return user;
}

export function signOutUser(): void {
	auth.signOut();
}

export function isUserSignedIn(): boolean {
	return !!auth.currentUser;
}

export const getErrorMessage = (error: Error): string => {
	if (error instanceof FirebaseError) {
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
	}

	return 'Something went wrong, please try again';
};
