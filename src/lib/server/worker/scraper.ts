import { parse, HTMLElement } from 'node-html-parser';

const domains = ['www.amazon.com', 'www.ebay.com'];

interface OpenGraphData {
	title: string;
	description: string;
	image: string;
	siteName: string;
}

export interface ScrapeSchema extends OpenGraphData {
	price: string;
	seller: string;
}

export class Scraper {
	url: URL;
	_root: HTMLElement | null = null;

	constructor(url: string) {
		this.url = new URL(url);

		if (!domains.includes(this.url.hostname)) throw new Error('Unsupported site');
	}

	async scrape(): Promise<ScrapeSchema> {
		switch (this.url.hostname) {
			case 'www.amazon.com':
				return this.scrapeAmazon();
			case 'www.ebay.com':
				return this.scrapeEbay();
			default:
				throw new Error('Unsupported site');
		}
	}

	// Helpers -----------------------------------------------------------------

	async root() {
		if (!this._root) {
			const res = await fetch(this.url.toString(), { headers: { 'User-Agent': 'Mozilla/5.0' } });
			this._root = parse(await res.text());
		}
		return this._root;
	}

	async getText(selector: string): Promise<string> {
		const root = await this.root();
		const raw = root.querySelector(selector)?.innerText ?? '';
		return raw.trim();
	}

	async getOpenGraphContent(property: string): Promise<string> {
		const root = await this.root();
		return root.querySelector(`meta[property='${property}']`)?.getAttribute('content') ?? '';
	}

	// Site Scrapers -----------------------------------------------------------

	private async scrapeOpenGraph(): Promise<OpenGraphData> {
		const title = await this.getOpenGraphContent('og:title');
		const description = await this.getOpenGraphContent('og:description');
		const image = await this.getOpenGraphContent('og:image');
		const siteName = await this.getOpenGraphContent('og:site_name');

		return { title, description, image, siteName };
	}

	private async scrapeAmazon(): Promise<ScrapeSchema> {
		// TODO: does Amazon have an open graph?
		const root = await this.root();
		const title = await this.getText('#productTitle');
		const description = await this.getText('#productDescription');
		const image = root.querySelector('#landingImage')?.getAttribute('src') ?? '';
		const price = await this.getText('.a-price .a-offscreen');
		const seller = await this.getText('#merchant-info');

		return { title, description, image, price, seller, siteName: 'Amazon' };
	}

	private async scrapeEbay(): Promise<ScrapeSchema> {
		const partial = await this.scrapeOpenGraph();
		const price = await this.getText('.x-price-primary');
		const seller = await this.getText('.ux-seller-section__item--seller a');

		return { ...partial, price, seller, siteName: 'Ebay' };
	}
}
