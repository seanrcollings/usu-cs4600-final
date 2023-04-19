import { getCurrentUser } from '$lib/auth.js';
import { getErrorMessage } from '$lib/firestore/firestore.js';
import { addListItem, getListItems } from '$lib/firestore/items.js';
import { getUserList } from '$lib/firestore/lists.js';
import type { ListWithItems } from '$lib/types/firestore.js';
import { fail } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { listId } = params;

	const user = getCurrentUser();
	const uid = user?.uid;

	if (!uid) return { error: 'User is not logged in' };

	const listExists = await getUserList(uid, listId);
	if (!listExists) return { error: 'List not found' };

	try {
		const list = await getUserList(uid, listId);
		const items = await getListItems(uid, listId);

		const listWithItems: ListWithItems = { ...list, items };
		return { list: listWithItems };
	} catch (exc) {
		return { error: getErrorMessage(exc as Error) };
	}
};

export const actions = {
	create: async ({ request, params }) => {
		const { listId } = params;

		const data = await request.formData();
		const title = data.get('title') as string | null;
		const description = data.get('description') as string | null;
		const link = data.get('link') as string | null;

		if (!title || !description || !link) {
			return fail(400, {
				data: { title, description, link },
				message: 'All three fields are required'
			});
		}

		try {
			new URL(link);
		} catch (exc) {
			return fail(400, {
				data: { title, description, link },
				message: 'Enter a valid URL'
			});
		}

		const user = getCurrentUser();

		if (!user) {
			return fail(400, {
				data: { title, description, link },
				message: 'User is not logged in'
			});
		}

		const uid = user.uid;

		const listExists = await getUserList(uid, listId);

		if (!listExists) {
			return fail(400, {
				data: { title, description, link },
				message: 'List does not exist'
			});
		}

		try {
			const newItem = await addListItem(uid, listId, {
				title,
				description,
				seller: link,
				image: 'https://placehold.co/300x150'
			});

			return { newItem };
		} catch (exc) {
			return fail(400, {
				data: { title, description, link },
				message: getErrorMessage(exc as Error)
			});
		}
	}
};
