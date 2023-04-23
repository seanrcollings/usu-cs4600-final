import type { ListInvitation } from '$lib/types/firestore';
import { CollectionResource } from './collectionResource';

export class Invites extends CollectionResource<ListInvitation> {
	paths = {
		create: (segments: string[]) => `listInvitations`,
		list: (segments: string[]) => `listInvitations`,
		show: (segments: string[]) => `listInvitations/${segments[0]}`,
		update: (segments: string[]) => `listInvitations/${segments[0]}`,
		delete: (segments: string[]) => `listInvitations/${segments[0]}`
	};

	create<Create extends {}>(data: Create) {
		return super.create([], data);
	}
}
