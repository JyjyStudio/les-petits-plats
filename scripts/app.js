import CardFactory from './factories/CardFactory.js';
import Filter from './utils/Filter.js';


class App {
	constructor() {
		this.factory = new CardFactory();
		this.filter = new Filter();
	}

	async main() {
		
		this.factory.createCards();
		
		this.filter;
		
	}
}

const app = new App();

app.main();
