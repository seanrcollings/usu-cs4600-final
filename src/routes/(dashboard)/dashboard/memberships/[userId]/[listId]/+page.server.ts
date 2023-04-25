import { error, fail } from '@sveltejs/kit';
import { requiresUser } from '$lib/server/firebase/auth.js';
import { Items } from '$lib/server/firestore/items.js';
import { Lists } from '$lib/server/firestore/lists.js';

const listsClient = new Lists();
const itemsClient = new Items();

export async function load({ params, locals }) {
	const user = requiresUser(locals);
	const { userId, listId } = params;
	const list = await listsClient.show(userId, listId);

	if (!list || !list.members.includes(user.uid)) {
		throw error(404, 'Not Found');
	}

	const listItems = await itemsClient.list(userId, listId);

	return { list: { ...list, items: listItems } };
}

export const actions = {
	claim: async ({ request, params, locals }) => {
		const currUser = requiresUser(locals);
		const { userId, listId } = params;
		const list = await listsClient.show(userId, listId);

		if (!list || !list.members.includes(currUser.uid)) {
			throw error(404, 'Not Found');
		}

		const data = await request.formData();
		const type = data.get('type') as string;
		const itemId = data.get('itemId') as string;

		if (!type) {
			return fail(400, { message: 'Bad Request' });
		}

		if (type === 'SINGLE') {
			await itemsClient.update([userId, listId, itemId], {
				claim: {
					type,
					claimedBy: { email: currUser.email!, uid: currUser.uid }
				}
			});
		} else if (type === 'SPLIT') {
			await itemsClient.update([userId, listId, itemId], {
				claim: {
					type,
					splitBy: [{ email: currUser.email!, uid: currUser.uid }]
				}
			});
		} else if (type === 'POOL') {
			await itemsClient.update([userId, listId, itemId], {
				claim: {
					type,
					price: 50,
					pool: []
				}
			});
		} else {
			return fail(400, { message: 'Bad Request' });
		}
	},

	split: async ({ request, params, locals }) => {
		const currUser = requiresUser(locals);
		const { userId, listId } = params;
		const list = await listsClient.show(userId, listId);

		if (!list || !list.members.includes(currUser.uid)) {
			throw error(404, 'Not Found');
		}

		const data = await request.formData();
		const itemId = data.get('itemId') as string;

		const item = await itemsClient.show(userId, listId, itemId);
		if (item?.claim?.type !== 'SPLIT') {
			return fail(400, { message: 'Bad Request' });
		}

		await itemsClient.update([userId, listId, itemId], {
			claim: {
				...item.claim,
				splitBy: [...item.claim.splitBy, { email: currUser.email!, uid: currUser.uid }]
			}
		});
	},

	pool: async ({ request, params, locals }) => {
		const currUser = requiresUser(locals);
		const { userId, listId } = params;
		const list = await listsClient.show(userId, listId);

		if (!list || !list.members.includes(currUser.uid)) {
			throw error(404, 'Not Found');
		}

		const data = await request.formData();
		const itemId = data.get('itemId') as string;

		const amount = parseFloat(data.get('amount') as string);

		if (isNaN(amount)) {
			return fail(400, { message: 'Invalid amount' });
		}

		const item = await itemsClient.show(userId, listId, itemId);
		if (item?.claim?.type !== 'POOL') {
			return fail(400, { message: 'Incorrect claim type for item' });
		}

		if (item.claim.pool.find((p) => p.uid === currUser.uid)) {
			await itemsClient.update([userId, listId, itemId], {
				claim: {
					...item.claim,
					pool: item.claim.pool.map((p) =>
						p.uid === currUser.uid ? { ...p, amount: amount + p.amount } : p
					)
				}
			});
		} else {
			await itemsClient.update([userId, listId, itemId], {
				claim: {
					...item.claim,
					pool: [...item.claim.pool, { email: currUser.email!, uid: currUser.uid, amount }]
				}
			});
		}
	}
};
