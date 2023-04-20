import {
	addDoc,
	collection,
	getDoc,
	type Firestore,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	type DocumentData,
	Timestamp,
	FirestoreError
} from 'firebase/firestore';

export class CollectionResource<Resource> {
	db: Firestore;

	constructor(db: Firestore) {
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
		const resourceCollection = collection(this.db, path);
		const docRef = await addDoc(resourceCollection, data);
		const doc = await getDoc(docRef);
		const docData = this.sanitize(doc.data() as Resource);

		return { id: doc.id, ...docData } as unknown as Resource;
	}

	async list(...pathSegments: string[]): Promise<Resource[]> {
		const path = this.paths.list(pathSegments);
		const resourceCollection = collection(this.db, path);
		const snapshot = await getDocs(resourceCollection);
		const resources = snapshot.docs.map((doc) => {
			const docData = this.sanitize(doc.data() as Resource);
			return { id: doc.id, ...docData };
		});
		return resources as unknown as Resource[];
	}

	async show(...pathSegments: string[]): Promise<Resource | null> {
		const path = this.paths.show(pathSegments);
		const docRef = doc(this.db, path);
		const snapshot = await getDoc(docRef);
		if (!snapshot.exists()) return null;

		const docData = this.sanitize(snapshot.data() as Resource);

		return { id: snapshot.id, ...docData } as unknown as Resource;
	}

	async exists(...pathSegments: string[]): Promise<boolean> {
		const path = this.paths.show(pathSegments);
		const docRef = doc(this.db, path);
		const snapshot = await getDoc(docRef);
		return snapshot.exists();
	}

	async update(pathSegments: string[], data: Partial<Resource>): Promise<void> {
		const path = this.paths.update(pathSegments);
		const docRef = doc(this.db, path);
		// @ts-ignore
		await updateDoc(docRef, { ...data });
	}

	async delete(...pathSegments: string[]): Promise<void> {
		const path = this.paths.delete(pathSegments);
		const docRef = doc(this.db, path);
		await deleteDoc(docRef);
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
