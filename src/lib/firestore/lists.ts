import {
	collection,
	Timestamp,
	type CollectionReference,
	type DocumentData,
	getDocs,
	addDoc,
	getDoc,
	deleteDoc,
	doc,
	collectionGroup,
	query,
	where,
	FirestoreError
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
	members: string[];
}

export async function getUserLists(uid: string): Promise<List[]> {
	const lists = userLists(uid);
	const snapshot = await getDocs(lists);
	const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

	return (data as unknown as InListData[]).map((list) => ({
		id: list.id,
		name: list.name,
		userId: uid,
		members: list.members,
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
		userId: uid,
		members: [],
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
		id: list.id,
		userId: uid,
		members: data.members,
		createdAt: data.createdAt.toDate(),
		eventDate: data.eventDate.toDate()
	};
}

export async function doesUserListExist(uid: string, id: string): Promise<boolean> {
	const docRef = doc(firestore, `users/${uid}/lists`, id);
	const list = await getDoc(docRef);
	return list.exists();
}

export async function deleteUserList(uid: string, id: string): Promise<void> {
	await deleteDoc(doc(firestore, `users/${uid}/lists/${id}`));
}

export async function getUserMembershipLists(uid: string): Promise<List[]> {
	const q = query(collectionGroup(firestore, 'lists'), where('members', 'array-contains', uid));
	const snapshot = await getDocs(q);
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		userId: doc.ref.parent.parent?.id,
		...doc.data()
	})) as any as (InListData & { userId: string })[];

	return data.map((list) => ({
		id: list.id,
		userId: list.userId,
		name: list.name,
		members: list.members,
		createdAt: list.createdAt.toDate(),
		eventDate: list.eventDate.toDate()
	}));
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
