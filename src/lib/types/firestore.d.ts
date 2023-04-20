export interface List {
	id: string;
	name: string;
	createdAt: Date;
	eventDate: Date;
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
