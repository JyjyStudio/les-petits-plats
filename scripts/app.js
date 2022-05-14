import CardFactory from './factories/CardFactory.js';
import Filter from './utils/Filter.js';
import Tag from './utils/Tag.js';

class App {
	constructor() {
		this.factory = new CardFactory();
		this.filter = new Filter();
		this.tag = new Tag();
	}

	async main() {
		
		this.factory.createCards();
		
		this.filter;

		this.tag.filterTags();
		
	}
}

const app = new App();

app.main();
