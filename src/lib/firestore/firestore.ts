import { getFirestore, FirestoreError } from 'firebase/firestore';
import { app } from '../firebase.js';

export const firestore = getFirestore(app);

export function getErrorMessage(error: Error): string {
	if (error instanceof FirestoreError) {
		switch (error.code) {
			case 'not-found':
				return 'No object exists at the desired location';
			case 'already-exists':
				return 'An object already exists at the desired location';
			default:
				return 'Something went wrong, please try again';
		}
	}

	return 'Something went wrong, please try again';
}
