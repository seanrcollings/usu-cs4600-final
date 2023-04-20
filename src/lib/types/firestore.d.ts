export interface List {
	id: string;
	name: string;
	createdAt: Date;
	eventDate: Date;
	userId: string;
	members: string[];
}

export interface Item {
	title: string;
	description: string;
	image: string;
	price?: string;
	seller?: string;
}

export interface ListWithItems extends List {
	items: Item[];
}
