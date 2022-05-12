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
			const res_1 = await res.json();
			return res_1.recipes;
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
