import { requiresUser } from '$lib/server/firebase/auth.js';
import { Items } from '$lib/server/firestore/items.js';
import { Lists } from '$lib/server/firestore/lists.js';
import { error } from '@sveltejs/kit';

const listsClient = new Lists();
const itemsClient = new Items();

export async function load({ params, locals }) {
	const user = requiresUser(locals);
	const { userId, listId } = params;
	const list = await listsClient.show(userId, listId);

	if (!list || !list.members.includes(user.uid)) {
		throw error(404, 'Not Found');
	}

	const listItems = await itemsClient.list(userId, listId);

	return { list: { ...list, items: listItems } };
}
