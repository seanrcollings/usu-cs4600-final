import { fail } from '@sveltejs/kit';
import { compareAsc } from 'date-fns';
import { Lists } from '$lib/server/firestore/lists';
import type { Actions } from './$types.js';
import { requiresUser } from '$lib/server/firebase/auth.js';

const listsClient = new Lists();

export const load = async ({ locals, url }) => {
	const { uid } = requiresUser(locals);

	let lists = (await listsClient.list(uid)).sort((a, b) => compareAsc(a.eventDate, b.eventDate));

	return { lists };
};

export const actions = {
	create: async ({ request, locals }) => {
		const { email, uid } = requiresUser(locals);
		const data = await request.formData();
		const name = data.get('name') as string | null;
		const eventDate = data.get('eventDate') as string | null;

		if (!name || !eventDate) {
			return fail(400, { data: { name }, message: 'Name and date are required' });
		}

		try {
			const newList = await listsClient.create([uid], {
				name,
				eventDate: new Date(eventDate),
				owner: { uid, email }
			});
			return { newList };
		} catch (exc) {
			console.error(exc);
			return fail(400, { data: { name }, message: 'Something went wrong' });
		}
	},
	delete: async ({ request, locals }) => {
		const { uid } = requiresUser(locals);
		const data = await request.formData();
		const id = data.get('id') as string | null;

		if (!id) {
			return fail(400, { data: { id }, message: 'ID is required' });
		}

		try {
			await listsClient.delete(uid, id);
			return { id };
		} catch (exc) {
			return fail(400, { data: { id }, message: 'Something went wrong' });
		}
	}
} satisfies Actions;
