import { fail, redirect } from '@sveltejs/kit';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import type { ListWithItems } from '$lib/types/firestore.js';
import { getErrorMessage } from '$lib/server/firestore/firestore';
import { Items } from '$lib/server/firestore/items';
import { Lists } from '$lib/server/firestore/lists';
import { Invites } from '$lib/server/firestore/invites';
import { requiresUser } from '$lib/server/firebase/auth.js';
import type { PageServerLoad } from './$types.js';

const listsClient = new Lists();
const itemsClient = new Items();
const invitesClient = new Invites();
const connection = new IORedis(REDIS_URL);
const scrapeQueue = new Queue('Scrape', { connection });
const inviteQueue = new Queue('Invite', { connection });

export const load: PageServerLoad = async ({ params, locals }) => {
	const { listId } = params;
	const { uid } = requiresUser(locals);

	const list = await listsClient.show(uid, listId);
	if (!list) throw redirect(302, '/dashboard');

	const listItems = await itemsClient.list(uid, listId);
	const listWithItems: ListWithItems = { ...list, items: listItems };

	return { list: listWithItems };
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
	},

	invite: async ({ params, request, locals }) => {
		const currUser = requiresUser(locals);
		const data = await request.formData();
		const { listId } = params;
		const contacts = data.get('contacts') as string | null;

		if (!contacts) {
			return fail(400, { data: { contacts }, message: 'Must provide at least one contact' });
		}

		if (!listsClient.show(currUser.uid, listId)) {
			return fail(404, { data: { listId }, message: 'List not found' });
		}

		const contactList = contacts.split(',');

		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

		for (const contact of contactList) {
			if (!emailRegex.test(contact)) {
				return fail(400, { data: { contacts }, message: `Invalid email address: ${contact}` });
			}
		}

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
