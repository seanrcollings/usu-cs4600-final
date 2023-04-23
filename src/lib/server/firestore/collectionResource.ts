import type { Firestore } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { firestore } from './firestore.js';

export class CollectionResource<Resource> {
	db: Firestore;

	constructor(db: Firestore = firestore) {
		this.db = db;
	}

	paths = {
		create: (segments: string[]) => '',
		list: (segments: string[]) => '',
		show: (segments: string[]) => '',
		update: (segments: string[]) => '',
		delete: (segments: string[]) => ''
	};

	async create<Create extends {}>(pathSegments: string[], data: Create): Promise<Resource> {
		const path = this.paths.create(pathSegments);
		const doc = this.db.collection(path).doc();
		await doc.create({ ...data, createdAt: new Date() });

		const res = await doc.get();
		const docData = this.sanitize(res.data() as Resource);
		return { id: doc.id, ...docData } as unknown as Resource;
	}

	async list(...pathSegments: string[]): Promise<Resource[]> {
		const path = this.paths.list(pathSegments);
		const collection = this.db.collection(path);
		const snapshot = await collection.get();
		const resources = snapshot.docs.map((doc) => {
			const docData = this.sanitize(doc.data() as Resource);
			return { id: doc.id, ...docData };
		});
		return resources as unknown as Resource[];
	}

	async show(...pathSegments: string[]): Promise<Resource | null> {
		const path = this.paths.show(pathSegments);
		const doct = this.db.doc(path);
		const snapshot = await doct.get();

		if (!snapshot.exists) return null;

		const docData = this.sanitize(snapshot.data() as Resource);

		return { id: snapshot.id, ...docData } as unknown as Resource;
	}

	async update(pathSegments: string[], data: Partial<Resource>): Promise<void> {
		const path = this.paths.update(pathSegments);
		const doc = this.db.doc(path);
		await doc.update(data);
	}

	async delete(...pathSegments: string[]): Promise<void> {
		const path = this.paths.delete(pathSegments);
		const doc = this.db.doc(path);
		await doc.delete();
	}

	protected sanitize(data: Resource): Resource {
		return Object.fromEntries(
			Object.entries(data!).map(([key, value]) => {
				if (value instanceof Timestamp) return [key, value.toDate()];
				return [key, value];
			})
		) as Resource;
	}
}
