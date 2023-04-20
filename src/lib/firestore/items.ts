import type { Item } from '../types/firestore';
import { CollectionResource } from './collectionResource.js';

export class Items extends CollectionResource<Item> {
	paths = {
		create: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}/items`,
		list: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}/items`,
		show: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}/items/${segments[2]}`,
		update: (segments: string[]) =>
			`users/${segments[0]}/lists/${segments[1]}/items/${segments[2]}`,
		delete: (segments: string[]) => `users/${segments[0]}/lists/${segments[1]}/items/${segments[2]}`
	};
}
