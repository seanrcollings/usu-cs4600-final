import {
	addDoc,
	collection,
	getDoc,
	type Firestore,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	type DocumentData
} from 'firebase/firestore';

export class CollectionResource<Resource extends { id: string }> {
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
		const docData = doc.data();

		return { id: doc.id, ...docData } as unknown as Resource;
	}

	async list(...pathSegments: string[]): Promise<Resource[]> {
		const path = this.paths.list(pathSegments);
		const resourceCollection = collection(this.db, path);
		const snapshot = await getDocs(resourceCollection);
		const resources = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		return resources as unknown as Resource[];
	}

	async show(...pathSegments: string[]): Promise<Resource> {
		const path = this.paths.show(pathSegments);
		const docRef = doc(this.db, path);
		const snapshot = await getDoc(docRef);
		const docData = snapshot.data();

		return { id: snapshot.id, ...docData } as unknown as Resource;
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
}
