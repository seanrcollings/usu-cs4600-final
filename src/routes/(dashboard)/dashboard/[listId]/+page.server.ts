import { getCurrentUser } from '$lib/auth.js';
import { getErrorMessage } from '$lib/firestore/firestore.js';
import { getListItems } from '$lib/firestore/items.js';
import { getUserList } from '$lib/firestore/lists.js';
import type { ListWithItems } from '$lib/types/firestore.js';

export const load = async ({ params }) => {
	const { listId } = params;

	const user = getCurrentUser();
	const uid = user?.uid;

	if (!uid) return { error: 'User is not logged in' };

	try {
		const list = await getUserList(uid, listId);
		const items = await getListItems(uid, listId);

		const listWithItems: ListWithItems = { ...list, items };
		return { list: listWithItems };
	} catch (exc) {
		return { error: getErrorMessage(exc as Error) };
	}
};
