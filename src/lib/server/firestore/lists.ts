import type { List } from '$lib/types/firestore';
import { CollectionResource } from './collectionResource';

export class Lists extends CollectionResource<List> {
	paths = {
		create: (segments: string[]) => `/users/${segments[0]}/lists`,
		list: (segments: string[]) => `/users/${segments[0]}/lists`,
		show: (segments: string[]) => `/users/${segments[0]}/lists/${segments[1]}`,
		update: (segments: string[]) => `/users/${segments[0]}/lists/${segments[1]}`,
		delete: (segments: string[]) => `/users/${segments[0]}/lists/${segments[1]}`
	};

	async membershipLists(uid: string) {
		const snapshot = await this.db
			.collectionGroup('lists')
			.where('members', 'array-contains', uid)
			.get();

		const data = snapshot.docs.map((doc) =>
			this.sanitize({
				id: doc.id,
				userId: doc.ref.parent.parent?.id,
				...doc.data()
			} as any)
		) as (List & { userId: string })[];

		return data;
	}
}
