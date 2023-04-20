export interface List {
	id: string;
	name: string;
	createdAt: Date;
	eventDate: Date;
	members: string[];
	owner: { email: string; uid: string };
}

export interface Item {
	id: string;
	title: string;
	description: string;
	image: string;
	price?: string;
	seller?: string;
	createdAt: Date;
}

export interface ListWithItems extends List {
	items: Item[];
}

export interface ListInvitation {
	id: string;
	listId: string;
	invitedBy: { email: string; uid: string };
	singleUse: boolean;
	contact: string;
}
