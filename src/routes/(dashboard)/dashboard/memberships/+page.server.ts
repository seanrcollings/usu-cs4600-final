import { getCurrentUser } from '$lib/auth';
import { getUserMembershipLists } from '$lib/firestore/lists';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const user = getCurrentUser();
	if (!user) throw redirect(302, '/login');

	const lists = await getUserMembershipLists(user?.uid);

	return { lists };
}
