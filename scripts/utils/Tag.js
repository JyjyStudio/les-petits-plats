import RecipesApi from '../Api/Api.js';

export default class Tag {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.ingredientsTag = document.getElementById('filtre-ingredients');
		this.apprareilsTag = document.getElementById('filtre-appareils');
		this.ustensilesTag = document.getElementById('filtre-ustensiles');
	}

	async getData() {
		const data = await this.data;
		let ingredients = [];
		let appareils = [];
		let ustensiles = [];

		console.log(data);
		data.forEach(recipe => {
			recipe.appliance ? appareils.push(recipe.appliance) : '';
			recipe.ingredients.forEach(ingredient => ingredients.push(ingredient.ingredient));
			recipe.ustensils.forEach(ustensil => ustensiles.push(ustensil));
		});

		appareils = new Set(appareils);
		ingredients = new Set(ingredients);
		ustensiles = new Set(ustensiles);

		return {appareils, ingredients, ustensiles};
	}

	async displayTags() {

		const {appareils, ingredients, ustensiles} = await this.getData();

		this.ingredientsTag.addEventListener('click', () => {
			console.log(ingredients);
		});
		this.apprareilsTag.addEventListener('click', () => {
			console.log(appareils);
		});
		this.ustensilesTag.addEventListener('click', () => {
			console.log(ustensiles);
		});	
		
	}
	
}
