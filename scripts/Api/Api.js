class Api {
	/**
	 * 
	 * @param {string} url 
	 */
	constructor(url) {
		this.url = url;
	}

	async get() {
		return fetch(this.url)
			.then(res => res.json())
			.then(res => res.recipes)
			.catch(err => console.error('an error occurs', err));
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

	async getRecipes() {
		return await this.get();
	}
}
