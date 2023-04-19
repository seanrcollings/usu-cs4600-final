import { Worker } from 'bullmq';
import { config } from 'dotenv';
import IORedis from 'ioredis';
import { Scraper } from './scraper.js';

config();

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

new Worker(
	'Scrape',
	async (job) => {
		console.log(job.name);
		const scraper = new Scraper(job.data.url);
		const data = await scraper.scrape();
		// TODO: write the data to the DB
		console.log(data);
	},
	{ connection, concurrency: 1 }
);
