import { fail } from '@sveltejs/kit';
import { addUserList, deleteUserList, getErrorMessage, getUserLists } from '$lib/firestore';
import { getCurrentUser } from '$lib/auth';
import type { Actions } from './$types.js';

export const load = async ({ request, cookies }) => {
	const user = getCurrentUser();
	const uid = user?.uid;

	if (!uid) {
		return { lists: [] };
	}

	try {
		const lists = await getUserLists(uid);
		return {
			lists
		};
	} catch (exc) {
		console.log(getErrorMessage(exc as Error));
		return { lists: [] };
	}
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string | null;
		const eventDate = data.get('eventDate') as string | null;

		if (!name || !eventDate) {
			return fail(400, { data: { name }, message: 'Name and date are required' });
		}

		const user = getCurrentUser();
		if (!user) {
			return fail(400, { data: { name }, message: 'User is not logged in' });
		}

		const uid = user.uid;

		try {
			const newList = await addUserList(uid, { name, eventDate: new Date(eventDate) });
			return { newList };
		} catch (exc) {
			return fail(400, { data: { name }, message: getErrorMessage(exc as Error) });
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string | null;

		if (!id) {
			return fail(400, { data: { id }, message: 'ID is required' });
		}

		const user = getCurrentUser();
		if (!user) {
			return fail(400, { data: { id }, message: 'User is not logged in' });
		}

		const uid = user.uid;

		try {
			await deleteUserList(uid, id);
			return { id };
		} catch (exc) {
			return fail(400, { data: { id }, message: getErrorMessage(exc as Error) });
		}
	}
} satisfies Actions;
