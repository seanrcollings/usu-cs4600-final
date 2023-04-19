import { parse, HTMLElement } from 'node-html-parser';

const domains = ['www.amazon.com', 'www.ebay.com'];

interface OpenGraphData {
	title: string;
	description: string;
	image: string;
	siteName: string;
}

interface ScrapeSchema extends OpenGraphData {
	price: string;
	seller: string;
}

class Scaper {
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
			const res = await fetch(this.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

// 'https://www.amazon.com/SAMSUNG-Inch-Internal-MZ-77E1T0B-AM/dp/B08QBJ2YMG/?_encoding=UTF8&pd_rd_w=J02AL&content-id=amzn1.sym.bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_p=bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_r=4Q8XPAF32BQ8CW8MEWV2&pd_rd_wg=uGWxo&pd_rd_r=b63ebaf6-18de-4ca7-a71b-77750c8cab36&ref_=pd_gw_ci_mcx_mr_hp_atf_m&th=1'
const url =
	'https://www.ebay.com/itm/256025750930?epid=4055491995&hash=item3b9c52ed92:g:XXEAAOSwz1xkI6zH&amdata=enc%3AAQAIAAABAGlbqj5h1VLywgQ3ZMZp2%2Beiknxz4mwn5P7vr47Slv43T3Qcl%2BxwFQcQmk0J%2B%2FWFltyJg0wjg%2BIwTLi2FShiKiwnNpxIx1k1nv55BjGa4U0rWrn7EEod9frDaBwR4%2Ft%2F1Ew0ilB%2BDtSwJWL5YjrhyIoW6OALra1DB9PAfZ1UgR2D25IkNcMqu0OiSafISCE3ipZ1263FZsoBK0yCWNaAgZhjH2IH%2BO9b%2BcQ%2BtvP6kVitSxnvJmHgXUDBstztTZ1ElLi7J4IuwJZxCDsHHX4CZI%2F%2FVfmpqE8O1C5H3fzOxF71Ya1edT3GoTCgpaeF54W%2FILLq03%2F1%2FEGhtNyRQ1Qr8As%3D%7Ctkp%3ABFBMxqL4rPNh';
const scraper = new Scaper(url);

scraper.scrape().then(console.log);
