import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import domains from '$lib/domains';

const connection = new IORedis(REDIS_URL);
const queue = new Queue('Scrape', { connection });

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		let url;

		try {
			url = new URL(form.get('url') as string);
		} catch (err) {
			return fail(400, { success: false, error: 'Invalid URL' });
		}

		if (!domains.includes(new URL(url).hostname)) {
			return fail(400, { success: false, error: 'Unsupported site' });
		}

		queue.add('scrape', { url: url.toString() });
	}
};
