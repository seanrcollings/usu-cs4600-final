import {
	collection,
	Timestamp,
	type CollectionReference,
	type DocumentData,
	getDocs,
	addDoc,
	getDoc,
	doc
} from 'firebase/firestore';
import { firestore } from './firestore';
import type { List } from '$lib/types/firestore';

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

export async function getUserList(uid: string, id: string): Promise<List> {
	const docRef = doc(firestore, `users/${uid}/lists`, id);
	const list = await getDoc(docRef);
	const data = list.data() as InListData;

	return {
		...data,
		createdAt: data.createdAt.toDate(),
		eventDate: data.eventDate.toDate()
	};
}

export async function deleteUserList(uid: string, id: string): Promise<void> {
	const lists = userLists(uid);

	console.log(uid, id);
}
