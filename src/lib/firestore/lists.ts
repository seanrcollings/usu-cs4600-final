import { Timestamp, getDocs, collectionGroup, query, where } from 'firebase/firestore';
import { firestore } from './firestore';
import type { List } from '$lib/types/firestore';
import { CollectionResource } from './collectionResource';

export class Lists extends CollectionResource<List> {
	paths = {
		create: (segments: string[]) => `users/${segments[0]}/lists`,
		list: (segments: string[]) => `users/${segments[0]}/lists`,
		show: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}`,
		update: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}`,
		delete: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}`
	};
}

interface InListData {
	id: string;
	name: string;
	createdAt: Timestamp;
	eventDate: Timestamp;
	members: string[];
	owner: { email: string; uid: string };
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
		name: list.name,
		members: list.members,
		createdAt: list.createdAt.toDate(),
		eventDate: list.eventDate.toDate(),
		owner: list.owner
	}));
}
