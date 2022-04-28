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
		const appareilsTagsContainer = document.querySelector('.filtre-appareils-content');
		const ustensilesTagsContainer = document.querySelector('.filtre-ustensiles-content');
		
		const ingredientsFilter = document.getElementById('filtre-ingredients');
		const appareilsFilter = document.getElementById('filtre-appareils');
		const ustensilesFilter = document.getElementById('filtre-ustensiles');
		
		const ingredientsInput = document.getElementById('input-ingredients');
		const appareilsInput = document.getElementById('input-appareils');
		const ustensilesInput = document.getElementById('input-ustensiles');

		const filterIcons = document.querySelectorAll('.filtre i');
		const ingredientsIcon = filterIcons[0];
		const appareilsIcon = filterIcons[1];
		const ustencilesIcon = filterIcons[2];
		
		const getValuesAndBindEvent = (data, tagsContainer, filter, input, icon) => {
			data.forEach(dataValue => {
				tagsContainer.innerHTML += `<li class='tag'>${dataValue}</li>`;
			});
			styliseInputOnClick(filter, input, tagsContainer, icon);
		};

		const styliseInputOnClick = (filter, input, tagsContainer, icon) => {
			input.addEventListener('focus', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
			});
			input.addEventListener('focusout', () => {
				filter.classList.remove('selected');
				input.classList.remove('selected');
				tagsContainer.classList.remove('selected');
			});
			icon.addEventListener('click', ()=> {
				filter.classList.toggle('selected');
				input.classList.toggle('selected');
				tagsContainer.classList.toggle('selected');
			});
		};

		getValuesAndBindEvent(ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput, ingredientsIcon);
		getValuesAndBindEvent(appareils, appareilsTagsContainer, appareilsFilter, appareilsInput, appareilsIcon);
		getValuesAndBindEvent(ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput, ustencilesIcon);

	}
	
}
