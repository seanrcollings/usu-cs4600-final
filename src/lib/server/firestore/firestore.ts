import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../firebase/firebase.js';

export const firestore = getFirestore(app);

export function getErrorMessage(error: any): string {
	console.error(error);
	switch (error.code) {
		case 'not-found':
			return 'No object exists at the desired location';
		case 'already-exists':
			return 'An object already exists at the desired location';
		default:
			return 'Something went wrong, please try again';
	}
}
