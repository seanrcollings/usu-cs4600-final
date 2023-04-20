import { Worker } from 'bullmq';
import { config } from 'dotenv';
import IORedis from 'ioredis';
import { Scraper } from './scraper.js';
import { itemsClient } from './firestore.js';
import mail, { Messages } from './sendgrid.js';

config();
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

interface InviteData {
	contact: string;
	inviteId: string;
	listId: string;
	invitedBy: string;
}

new Worker<InviteData>(
	'Invite',
	async (job) => {
		const { contact, inviteId, listId, invitedBy } = job.data;
		try {
			await mail.send(Messages.invite(contact, invitedBy, inviteId));
			console.log(`Sent invite to ${contact} for list ${listId}`);
		} catch (exc) {
			console.error(exc);
		}
	},
	{ connection, concurrency: 10 }
);
