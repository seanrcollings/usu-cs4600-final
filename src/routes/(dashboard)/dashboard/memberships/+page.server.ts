import { requiresUser } from '$lib/server/firebase/auth.js';
import { Lists } from '$lib/server/firestore/lists';

const listsClient = new Lists();

export async function load({ locals }) {
	const { uid } = requiresUser(locals);
	const lists = await listsClient.membershipLists(uid);

	return { lists };
}
