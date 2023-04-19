import type { Item } from '$lib/types/firestore';
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from './firestore';

export async function getListItems(uid: string, listId: string): Promise<Item[]> {
	const itemCollection = collection(firestore, `users/${uid}/lists/${listId}/items`);
	const snapshot = await getDocs(itemCollection);
	const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	return items as unknown as Item[];
}

interface AddItemData {
	title: string;
	description: string;
	image: string;
	price?: string;
	seller?: string;
}

export async function addListItem(uid: string, listId: string, data: AddItemData): Promise<Item> {
	const itemCollection = collection(firestore, `users/${uid}/lists/${listId}/items`);
	const docRef = await addDoc(itemCollection, data);
	const doc = await getDoc(docRef);
	const docData = doc.data();

	return { id: doc.id, ...docData } as unknown as Item;
}
