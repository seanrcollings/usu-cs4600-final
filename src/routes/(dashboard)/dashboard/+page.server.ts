import { fail } from '@sveltejs/kit';
import { Lists } from '$lib/firestore/lists';
import { firestore, getErrorMessage } from '$lib/firestore/firestore';
import { getCurrentUser } from '$lib/auth';
import type { Actions } from './$types.js';

const listsClient = new Lists(firestore);

export const load = async () => {
	const { uid } = getCurrentUser();

	try {
		const lists = await listsClient.list(uid);
		return { lists };
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
		const uid = user.uid;

		try {
			const newList = listsClient.create([uid], {
				name,
				eventDate: new Date(eventDate),
				owner: { email: user.email!, uid }
			});

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
			await listsClient.delete(uid, id);
			return { id };
		} catch (exc) {
			return fail(400, { data: { id }, message: getErrorMessage(exc as Error) });
		}
	}
} satisfies Actions;
