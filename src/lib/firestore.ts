import { app } from './firebase';
import {
	getFirestore,
	collection,
	getDocs,
	type DocumentData,
	addDoc,
	getDoc,
	CollectionReference,
	FirestoreError,
	Timestamp,
	deleteDoc
} from 'firebase/firestore';
import type { List } from '$lib/types/firestore';

const firestore = getFirestore(app);

function userLists(uid: string): CollectionReference<DocumentData> {
	return collection(firestore, `users/${uid}/lists`);
}

interface InListData {
	id: string;
	name: string;
	createdAt: Timestamp;
	eventDate: Timestamp;
}

export async function getUserLists(uid: string): Promise<List[]> {
	const lists = userLists(uid);
	const snapshot = await getDocs(lists);
	const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

	return (data as unknown as InListData[]).map((list) => ({
		id: list.id,
		name: list.name,
		createdAt: list.createdAt.toDate(),
		eventDate: list.eventDate.toDate()
	}));
}

interface AddListData {
	name: string;
	eventDate: Date;
}

export async function addUserList(uid: string, data: AddListData): Promise<List> {
	const lists = userLists(uid);
	const docRef = await addDoc(lists, { ...data, createdAt: new Date() });
	const doc = await getDoc(docRef);
	const docData = doc.data();

	const returnData: List = {
		id: doc.id,
		name: docData?.name,
		createdAt: docData?.createdAt.toDate(),
		eventDate: docData?.eventDate.toDate()
	};

	return returnData;
}

export async function deleteUserList(uid: string, id: string): Promise<void> {
	const lists = userLists(uid);

	console.log(uid, id);
}

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
