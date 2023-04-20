import { fail, redirect } from '@sveltejs/kit';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import { getCurrentUser } from '$lib/auth.js';
import { firestore, getErrorMessage } from '$lib/firestore/firestore.js';
import type { ListWithItems } from '$lib/types/firestore.js';
import { Items } from '$lib/firestore/items.js';
import { Lists } from '$lib/firestore/lists.js';
import { Invites } from '$lib/firestore/invites.js';

const listsClient = new Lists(firestore);
const itemsClient = new Items(firestore);
const invitesClient = new Invites(firestore);

const connection = new IORedis(REDIS_URL);
const scrapeQueue = new Queue('Scrape', { connection });
const inviteQueue = new Queue('Invite', { connection });

export const load = async ({ params }) => {
	const { listId } = params;
	const { uid } = getCurrentUser();

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
	create: async ({ request, params }) => {
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

		const { uid } = getCurrentUser();

		const list = await listsClient.show(uid, listId);

		if (!list) {
			return fail(400, {
				data: { title, description, link },
				message: 'List does not exist'
			});
		}

		try {
			const newItem = await itemsClient.create([uid, listId], {
				title,
				description,
				seller: link,
				createdAt: new Date()
			});

			if (link) {
				await scrapeQueue.add('scrape', { url: link, uid, listId, itemId: newItem.id });
			}

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

		const list = await listsClient.show(uid, listId);

		if (!list) {
			return fail(400, {
				data: { itemId },
				message: 'List does not exist'
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
		const listExists = await listsClient.show(uid, listId);

		if (!listExists) {
			return fail(400, {
				data: { title, description, link },
				message: 'List does not exist'
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
	},

	invite: async ({ params, request }) => {
		const data = await request.formData();
		const { listId } = params;
		const contacts = data.get('contacts') as string | null;

		if (!contacts) {
			return fail(400, { data: { contacts }, message: 'Must provide at least one contact' });
		}

		const currUser = getCurrentUser();

		if (!listsClient.show(currUser.uid, listId)) {
			return fail(404, { data: { listId }, message: 'List not found' });
		}

		const contactList = contacts.split(',');

		try {
			await Promise.all(
				contactList.map(async (contact) => {
					const invite = await invitesClient.create({
						listId: listId,
						singleUse: true,
						contact: contact,
						invitedBy: { email: currUser.email, uid: currUser.uid }
					});
					inviteQueue.add('invite', {
						contact,
						inviteId: invite.id,
						listId,
						invitedBy: currUser.email
					});
					return invite;
				})
			);
			return { success: true };
		} catch (exc) {
			return fail(400, { data: { contacts }, message: getErrorMessage(exc as Error) });
		}
	}
};
