import { Invites } from '$lib/server/firestore/invites.js';
import { Lists } from '$lib/server/firestore/lists.js';
import { error, redirect } from '@sveltejs/kit';

const invitesClient = new Invites();
const listsClient = new Lists();

export async function load({ params, locals }) {
	const { inviteId } = params;

	const currUser = locals.user;
	if (!currUser) throw redirect(302, `/login?redirectTo=/invite/${inviteId}`);

	const invite = await invitesClient.show(inviteId);
	if (!invite) throw error(404, 'Invite not found');

	const list = await listsClient.show(invite.invitedBy.uid, invite.listId);
	if (!list) throw error(404, 'List not found');

	let updatedMembers = list.members;
	if (updatedMembers) {
		if (updatedMembers.includes(currUser.uid)) {
			throw redirect(302, `/dashboard/memberships/${list.owner.uid}/${list.id}`);
		}
		updatedMembers = [...updatedMembers, currUser.uid];
	} else {
		updatedMembers = [currUser.uid];
	}

	listsClient.update([invite.invitedBy.uid, invite.listId], {
		members: updatedMembers
	});

	if (invite.singleUse) {
		invitesClient.delete(inviteId);
	}

	throw redirect(302, `/dashboard/memberships/${list.owner.uid}/${list.id}`);
}
