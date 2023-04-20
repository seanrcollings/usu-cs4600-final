import { getCurrentUser } from '$lib/auth.js';
import { firestore } from '$lib/firestore/firestore.js';
import { Items } from '$lib/firestore/items.js';
import { Lists } from '$lib/firestore/lists.js';
import { error } from '@sveltejs/kit';

const listsClient = new Lists(firestore);
const itemsClient = new Items(firestore);

export async function load({ params }) {
	const { userId, listId } = params;
	const list = await listsClient.show(userId, listId);

	const currUser = getCurrentUser();

	if (!list || !list.members.includes(currUser.uid)) {
		throw error(404, 'Not Found');
	}

	const listItems = await itemsClient.list(userId, listId);

	return { list: { ...list, items: listItems } };
}
