import { auth } from '$lib/auth.js';
import { firestore } from '$lib/firestore/firestore.js';
import { Invites } from '$lib/firestore/invites.js';
import { Lists } from '$lib/firestore/lists.js';
import { error, redirect } from '@sveltejs/kit';

const invitesClient = new Invites(firestore);
const listsClient = new Lists(firestore);

export async function load({ params }) {
	const { inviteId } = params;

	const currUser = auth.currentUser;
	if (!currUser) throw redirect(302, `/login?redirectTo=/invite/${inviteId}`);

	const invite = await invitesClient.show(inviteId);
	if (!invite) throw error(404, 'Invite not found');

	const list = await listsClient.show(invite.invitedBy.uid, invite.listId);
	if (!list) throw error(404, 'List not found');

	let updatedMembers = list.members;
	if (updatedMembers) {
		if (updatedMembers.includes(currUser.uid)) {
			throw redirect(302, '/dashboard');
		}
		updatedMembers = [...updatedMembers, currUser.uid];
	} else {
		updatedMembers = [currUser.uid];
	}

	listsClient.update([invite.invitedBy.uid, invite.listId], {
		members: updatedMembers
	});

	// if (invite.singleUse) await invitesClient.delete(inviteId);

	throw redirect(302, '/dashboard');
}
