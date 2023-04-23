import { fail, redirect } from '@sveltejs/kit';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import type { ListWithItems } from '$lib/types/firestore.js';
import { getErrorMessage } from '$lib/server/firestore/firestore';
import { Items } from '$lib/server/firestore/items';
import { Lists } from '$lib/server/firestore/lists';
import { requiresUser } from '$lib/server/firebase/auth.js';

const listsClient = new Lists();
const itemsClient = new Items();
const connection = new IORedis(REDIS_URL);
const queue = new Queue('Scrape', { connection });

function scrapeItem(url: string, uid: string, listId: string, itemId: string): void {
	queue.add('scrape', { url, uid, listId, itemId });
}

export const load = async ({ params, locals }) => {
	const { listId } = params;
	const { uid } = requiresUser(locals);

	const list = await listsClient.show(uid, listId);
	if (!list) throw redirect(302, '/dashboard');

	try {
		const listItems = await itemsClient.list(uid, listId);
		const listWithItems: ListWithItems = { ...list, items: listItems };

		return { list: listWithItems };
	} catch (exc) {
		return { error: getErrorMessage(exc as Error) };
	}
};

export const actions = {
	create: async ({ request, params, locals }) => {
		const { uid } = requiresUser(locals);
		const { listId } = params;

		const data = await request.formData();
		const title = data.get('title') as string | null;
		const description = data.get('description') as string | null;
		const link = data.get('link') as string | null;

		if (!title) {
			return fail(400, {
				data: { title, description, link },
				message: 'A title is required'
			});
		}

		if (link) {
			try {
				new URL(link);
			} catch (exc) {
				return fail(400, {
					data: { title, description, link },
					message: 'Enter a valid URL'
				});
			}
		}

		try {
			const newItem = await itemsClient.create([uid, listId], {
				title,
				description,
				seller: link,
				createdAt: new Date()
			});

			if (link) scrapeItem(link, uid, listId, newItem.id);

			return { newItem };
		} catch (exc) {
			return fail(400, {
				data: { title, description, link },
				message: getErrorMessage(exc as Error)
			});
		}
	},
	delete: async ({ request, params, locals }) => {
		const { uid } = requiresUser(locals);
		const { listId } = params;
		const data = await request.formData();
		const itemId = data.get('id') as string | null;

		if (!itemId) {
			return fail(400, {
				data: { itemId },
				message: 'Item ID is required'
			});
		}

		try {
			await itemsClient.delete(uid, listId, itemId);
			return { itemId };
		} catch (exc) {
			return fail(400, {
				data: { itemId },
				message: getErrorMessage(exc as Error)
			});
		}
	},
	update: async ({ request, params, locals }) => {
		const { uid } = requiresUser(locals);
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

		try {
			const newItem = await itemsClient.update([uid, listId, itemId], {
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
