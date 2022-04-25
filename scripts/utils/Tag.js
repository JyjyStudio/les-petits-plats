import RecipesApi from '../Api/Api.js';

export default class Tag {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
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

		const ingredientsTagsContainer = document.querySelector('.filtre-ingredients-content');
		const apprareilsTagsContainer = document.querySelector('.filtre-appareils-content');
		const ustensilesTagsContainer = document.querySelector('.filtre-ustensiles-content');
		
		const ingredientsFilter = document.getElementById('filtre-ingredients');
		const appareilsFilter = document.getElementById('filtre-appareils');
		const ustensilesFilter = document.getElementById('filtre-ustensiles');
		
		const ingredientsInput = document.getElementById('input-ingredients');
		const appareilsInput = document.getElementById('input-appareils');
		const ustensilesInput = document.getElementById('input-ustensiles');

		function styliseInputOnClick(filter, input, element, tagsContainer) {
			filter.classList.add('clicked');
			input.classList.add('clicked');
			input.placeholder = `Rechercher un ${element}`;
			tagsContainer.style.height = '300px';
			tagsContainer.style.display = 'grid';
		}
		
		ingredientsTagsContainer.addEventListener('click', (e) => {
			console.log(e.target);
			if(e.target !== ingredientsFilter) {
				ingredientsTagsContainer.style.display = 'none';
			}
		});
		ingredients.forEach(ingredient => {
			ingredientsTagsContainer.innerHTML += `<li class='tag'>${ingredient}</li>`;
		});
		ingredientsFilter.addEventListener('click', () => {
			styliseInputOnClick(ingredientsFilter, ingredientsInput, 'ingredient', ingredientsTagsContainer);
		});

		appareils.forEach(appareil => {
			apprareilsTagsContainer.innerHTML += `<li class='tag'>${appareil}</li>`;
		});
		appareilsFilter.addEventListener('click', () => {
			styliseInputOnClick(appareilsFilter, appareilsInput, 'appareil', apprareilsTagsContainer);
		});

		ustensiles.forEach(ustensile => {
			ustensilesTagsContainer.innerHTML += `<li class='tag'>${ustensile}</li>`;
		});
		ustensilesFilter.addEventListener('click', () => {
			styliseInputOnClick(ustensilesFilter, ustensilesInput, 'ustensile', ustensilesTagsContainer);			
		});	
		
	}
	
}
