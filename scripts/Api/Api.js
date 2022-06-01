class Api {
	/**
	 * 
	 * @param {string} url 
	 */
	constructor(url) {
		this.url = url;
	}

	async get() {
		try {
			const res = await fetch(this.url);
			const data = await res.json();
			return data.recipes;
		} catch (err) {
			return console.error('an error occurs', err);
		}
	}
}

export default class RecipesApi extends Api {
	/**
	 * 
	 * @param {string} url 
	 */
	constructor(url) {
		super(url);
	}
	getRecipes() {
		return this.get();
	}
}
