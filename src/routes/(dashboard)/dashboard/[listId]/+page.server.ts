import { fail, redirect } from '@sveltejs/kit';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import { getCurrentUser } from '$lib/auth.js';
import { firestore, getErrorMessage } from '$lib/firestore/firestore.js';
import { getUserList } from '$lib/firestore/lists.js';
import type { ListWithItems } from '$lib/types/firestore.js';
import { Items } from '$lib/firestore/items.js';

export const load = async ({ params }) => {
	const { listId } = params;
	const { uid } = getCurrentUser();

	const listExists = await getUserList(uid, listId);
	if (!listExists) throw redirect(302, '/dashboard');

	try {
		const list = await getUserList(uid, listId);
		const listItems = await items.list(uid, listId);
		const listWithItems: ListWithItems = { ...list, items: listItems };

		return { list: listWithItems };
	} catch (exc) {
		return { error: getErrorMessage(exc as Error) };
	}
};

const items = new Items(firestore);
const connection = new IORedis(REDIS_URL);
const queue = new Queue('Scrape', { connection });

function scrapeItem(url: string, uid: string, listId: string, itemId: string): void {
	queue.add('scrape', { url, uid, listId, itemId });
}

export const actions = {
	create: async ({ request, params }) => {
		const { listId } = params;

		const data = await request.formData();
		const title = data.get('title') as string | null;
		const description = data.get('description') as string | null;
		const link = data.get('link') as string | null;

		// if (!title || !description || !link) {
		// 	return fail(400, {
		// 		data: { title, description, link },
		// 		message: 'All three fields are required'
		// 	});
		// }

		try {
			new URL(link);
		} catch (exc) {
			return fail(400, {
				data: { title, description, link },
				message: 'Enter a valid URL'
			});
		}

		const { uid } = getCurrentUser();

		const listExists = await getUserList(uid, listId);

		if (!listExists) {
			return fail(400, {
				data: { title, description, link },
				message: 'List does not exist'
			});
		}

		try {
			const newItem = await items.create([uid, listId], {
				title,
				description,
				seller: link
			});

			scrapeItem(link, uid, listId, newItem.id);

			return { newItem };
		} catch (exc) {
			return fail(400, {
				data: { title, description, link },
				message: getErrorMessage(exc as Error)
			});
		}
	},
	delete: async ({ request, params }) => {
		const { listId } = params;
		const data = await request.formData();
		const itemId = data.get('id') as string | null;

		if (!itemId) {
			return fail(400, {
				data: { itemId },
				message: 'Item ID is required'
			});
		}

		const { uid } = getCurrentUser();

		const listExists = await getUserList(uid, listId);

		if (!listExists) {
			return fail(400, {
				data: { itemId },
				message: 'List does not exist'
			});
		}

		try {
			await items.delete(uid, listId, itemId);
			return { itemId };
		} catch (exc) {
			return fail(400, {
				data: { itemId },
				message: getErrorMessage(exc as Error)
			});
		}
	},
	update: async ({ request, params }) => {
		const { listId } = params;

		const data = await request.formData();
		const title = data.get('title') as string | null;
		const description = data.get('description') as string | null;
		const link = data.get('link') as string | null;
		const itemId = data.get('id') as string | null;

		if (!itemId || !title || !description || !link) {
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

		const { uid } = getCurrentUser();
		const listExists = await getUserList(uid, listId);

		if (!listExists) {
			return fail(400, {
				data: { title, description, link },
				message: 'List does not exist'
			});
		}

		try {
			const newItem = await items.update([uid, listId, itemId], {
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
