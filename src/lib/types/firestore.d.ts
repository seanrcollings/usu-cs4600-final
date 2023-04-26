export interface SimpleUserDetails {
	uid: string;
	email: string;
}

export interface List {
	id: string;
	name: string;
	createdAt: Date;
	eventDate: Date;
	members: string[];
	owner: SimpleUserDetails;
}

export interface Item {
	id: string;
	title: string;
	description: string;
	image: string;
	price?: string;
	seller?: string;
	createdAt: Date;
	claim?: Claim;
}

export interface ListWithItems extends List {
	items: Item[];
}

export interface ListInvitation {
	id: string;
	listId: string;
	invitedBy: SimpleUserDetails;
	singleUse: boolean;
	contact: string | 'MANUAL';
}

export interface SingleClaim {
	type: 'SINGLE';
	claimedBy: SimpleUserDetails;
}

export interface SplitClaim {
	type: 'SPLIT';
	splitBy: SimpleUserDetails[];
}

export interface PoolClaim {
	type: 'POOL';
	price: number;
	isPercent: boolean;
	pool: { uid: string; email: string; amount: number }[];
}

export type Claim = SingleClaim | SplitClaim | PoolClaim;
