import { Worker } from 'bullmq';
import { config } from 'dotenv';
import IORedis from 'ioredis';

config();

const connection = new IORedis(process.env.REDIS_URL!);

new Worker(
	'Scrape',
	async (job) => {
		console.log(job);
	},
	{ connection }
);
