import CardFactory from './factories/CardFactory.js';
import Filter_A from './utils/Filter.js';
// import Filter_B from './utils/Filter_B.js';

class App {
	
	constructor() {
		this.factory = new CardFactory();
		this.filter_A = new Filter_A();
		// this.filter_B = new Filter_B();
	}

	async main() {

		this.factory.createCards();
		this.filter_A.filterBy_Searchbar_Tags();
		// this.filter_B.filterBy_Searchbar_Tags();

	}

}

const app = new App();

app.main();
