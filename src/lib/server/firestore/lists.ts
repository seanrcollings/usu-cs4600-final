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
}
