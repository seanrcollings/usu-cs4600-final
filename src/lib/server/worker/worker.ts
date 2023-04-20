import { Worker } from 'bullmq';
import { config } from 'dotenv';
import IORedis from 'ioredis';
import { Scraper } from './scraper.js';
import { Items } from '../../firestore/items.js';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

config();

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const items = new Items(firestore);

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

interface ScrapeData {
	url: string;
	uid: string;
	listId: string;
	itemId: string;
}

new Worker<ScrapeData>(
	'Scrape',
	async (job) => {
		const { url, uid, listId, itemId } = job.data;
		const scraper = new Scraper(url);
		const data = await scraper.scrape();

		console.log(`Scraped ${url} for /user/${uid}/list/${listId}/item/${itemId}`);

		const item = await items.show(uid, listId, itemId);
		if (!item) return;

		const updated = {
			title: item.title || data.title,
			description: item.description || data.description,
			image: item.image || data.image,
			seller: item.seller || data.seller,
			price: item.price || data.price
		};

		items.update([uid, listId, itemId], updated);
	},
	{ connection, concurrency: 1 }
);
