import type { Item } from '$lib/types/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firestore';

export async function getListItems(uid: string, listId: string): Promise<Item[]> {
	const itemCollection = collection(firestore, `users/${uid}/lists/${listId}/items`);
	const snapshot = await getDocs(itemCollection);
	const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	return items as unknown as Item[];
}
