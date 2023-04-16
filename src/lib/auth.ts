import {
	getAuth,
	createUserWithEmailAndPassword,
	type User,
	signInWithEmailAndPassword
} from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

export async function createUser(email: string, password: string): Promise<User> {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);

	return user;
}

export async function signInUser(email: string, password: string): Promise<User> {
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	return user;
}
