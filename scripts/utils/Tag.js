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

		ingredients = Array.from(new Set(ingredients)).slice(0, 25);
		appareils = new Set(appareils);
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

		/**
		 * Récupere la data, et affiche les tags. puis gère les evenements via la fonction styliseInputOnClick()
		 * @param {Array} data - tébleau d'objets qui contient toute la data qui provient du fichier json 
		 * @param {HTMLElement} tagsContainer - container de tous les tags
		 * @param {HTMLElement} filter - container global de chaque filtre
		 * @param {HTMLElement} input - l'input de chaque filtre
		 * @param {HTMLElement} icon - icone à droite de l'input qui permet d'ouvrir ou de fermer la liste des tags
		 */
		const getValuesAndBindEvent = (data, tagsContainer, filter, input, icon) => {
			data.forEach(dataValue => {
				tagsContainer.innerHTML += `<li class='tag'>${dataValue}</li>`;
			});
			styliseInputOnClick(filter, input, tagsContainer, icon);
		};

		/**
		 * Gère les evenements liés aux tags
		 * @param {HTMLElement} filter - container global de chaque filtre
		 * @param {HTMLElement} input - l'input de chaque filtre
		 * @param {HTMLElement} tagsContainer - container de tous les tags
		 * @param {HTMLElement} icon - icone à droite de l'input qui permet d'ouvrir ou de fermer la liste des tags
		 */
		const styliseInputOnClick = (filter, input, tagsContainer, icon) => {
			// l'input s'ouvre en cliquant sur çelui ci 
			input.addEventListener('focus', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
			});
			// lorsque l'input est ouvert, il se ferme en cliquant en dehors
			document.addEventListener('click', event => {
				if (event.target.parentElement !== document.querySelector('.filtre.selected')) {
					filter.classList.remove('selected');
					input.classList.remove('selected');
					tagsContainer.classList.remove('selected');
				}
			});
			// en cliquant sur l'icone chevron, l'input s'ouvre ou se ferme
			icon.addEventListener('click', ()=> {
				filter.classList.toggle('selected');
				input.classList.toggle('selected');
				tagsContainer.classList.toggle('selected');
				input.classList.contains('selected') ? input.focus() : '';
			});
			// les inputs s'ouvrent en tabulant dessu et se ferment en allant à l'élément suivant
			document.addEventListener('keyup', event => { 
				if(event.key == 'Tab') {
					input.addEventListener('focusout', () => {
						filter.classList.remove('selected');
						input.classList.remove('selected');
						tagsContainer.classList.remove('selected');
					});
				}
			}) ;
		};

		getValuesAndBindEvent(ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput, ingredientsIcon);
		getValuesAndBindEvent(appareils, appareilsTagsContainer, appareilsFilter, appareilsInput, appareilsIcon);
		getValuesAndBindEvent(ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput, ustencilesIcon);

	}
	
}
