import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Scraper } from './scraper.js';
import { Items } from '../firestore/items.js';

const itemsClient = new Items();

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

		const item = await itemsClient.show(uid, listId, itemId);
		if (!item) return;

		const updated = {
			title: item.title || data.title,
			description: item.description || data.description,
			image: item.image || data.image,
			seller: item.seller || data.seller,
			price: item.price || data.price
		};

		itemsClient.update([uid, listId, itemId], updated);
	},
	{ connection, concurrency: 1 }
);
