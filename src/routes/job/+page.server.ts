import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';

const connection = new IORedis(REDIS_URL);
const queue = new Queue('Scrape', { connection });

export const actions = {
	default: () => {
		queue.add('name', { val: 1 });
	}
};
