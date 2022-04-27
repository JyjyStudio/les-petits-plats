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
		const appareilsTagsContainer = document.querySelector('.filtre-appareils-content');
		const ustensilesTagsContainer = document.querySelector('.filtre-ustensiles-content');
		
		const ingredientsFilter = document.getElementById('filtre-ingredients');
		const appareilsFilter = document.getElementById('filtre-appareils');
		const ustensilesFilter = document.getElementById('filtre-ustensiles');
		
		const ingredientsInput = document.getElementById('input-ingredients');
		const appareilsInput = document.getElementById('input-appareils');
		const ustensilesInput = document.getElementById('input-ustensiles');
		
		const getValuesAndBindEvent = (data, tagsContainer, filter, input) => {
			data.forEach(dataValue => {
				tagsContainer.innerHTML += `<li class='tag'>${dataValue}</li>`;
			});
			styliseInputOnClick(filter, input, tagsContainer);
		};

		const styliseInputOnClick = (filter, input, tagsContainer) => {
			filter.addEventListener('click', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
				const closeIcon = document.querySelector('.filtre.selected i');
				closeIcon.addEventListener('click', () => {
					console.log(filter.classList);
					filter.classList.toggle('selected');
					input.classList.toggle('selected');
					tagsContainer.classList.toggle('selected');
				});
			});
		};

		getValuesAndBindEvent(ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput);
		getValuesAndBindEvent(appareils, appareilsTagsContainer, appareilsFilter, appareilsInput);
		getValuesAndBindEvent(ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput);

		// faire en sorte que lorsque l'on clique en dehors de l'input selectionné, l'input se referme
		ingredientsTagsContainer.addEventListener('click', (e) => {
			console.log(e.target);
			if(e.target !== ingredientsFilter) {
				ingredientsTagsContainer.style.display = 'none';
			}
		});
		// fin
	}
	
}
