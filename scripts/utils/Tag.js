import RecipesApi from '../Api/Api.js';
import RecipeCard from '../templates/RecipeCard.js';
import Filter from './Filter.js';

export default class Tag {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.filter = new Filter();
	}

	async getData() {
		const data = await this.data;
		let ingredients = [];
		let appareils = [];
		let ustensiles = [];

		data.forEach(recipe => {
			recipe.appliance ? appareils.push(recipe.appliance.toLowerCase()) : '';
			recipe.ingredients.forEach(ingredient => ingredients.push(ingredient.ingredient.toLowerCase()));
			recipe.ustensils.forEach(ustensil => ustensiles.push(ustensil.toLowerCase()));
		});

		ingredients = new Set(ingredients);
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
		const renderValuesAndBindEvent = (data, tagsContainer, filter, input, icon) => {
			data.forEach(dataValue => {
				tagsContainer.innerHTML += `<li class='tag'>${dataValue.charAt(0).toUpperCase() + dataValue.slice(1)}</li>`;
			});
			styliseInputOnClick(filter, input, tagsContainer, icon, data);
		};

		/**
		 * Gère les evenements liés aux tags
		 * @param {HTMLElement} filter - container global de chaque filtre
		 * @param {HTMLElement} input - l'input de chaque filtre
		 * @param {HTMLElement} tagsContainer - container de tous les tags
		 * @param {HTMLElement} icon - icone à droite de l'input qui permet d'ouvrir ou de fermer la liste des tags
		 */
		const styliseInputOnClick = (filter, input, tagsContainer, icon, data) => {
			// l'input s'ouvre en cliquant sur çelui ci 
			input.addEventListener('focus', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
				renderTag(input, tagsContainer, data);
			});
			// lorsque l'input est ouvert, il se ferme en cliquant en dehors
			window.addEventListener('click', event => {
				if (event.target.parentElement !== document.querySelector('.selected')) {
					filter.classList.remove('selected');
					input.classList.remove('selected');
					tagsContainer.classList.remove('selected');
					input.value = '';
				}
			});
			// gestion des tab
			window.addEventListener('keyup', event => { 
				if(event.key == 'Tab') {
					if (document.activeElement !== input) {
						filter.classList.remove('selected');
						input.classList.remove('selected');
						tagsContainer.classList.remove('selected');
						input.value = '';
					}
				}
			});
			// en cliquant sur l'icone chevron, l'input s'ouvre ou se ferme
			icon.addEventListener('click', ()=> {
				filter.classList.toggle('selected');
				input.classList.toggle('selected');
				tagsContainer.classList.toggle('selected');
				input.classList.contains('selected') ? input.focus() : '';
			});
			// compare les valeurs recherchées et affiche un tag
			input.addEventListener('keyup', async () => {
				renderTag(input, tagsContainer, data);
			});
		};
		//affiche les tags en fonction des mots qui sont insérés dans l'input
		const renderTag = (input, tagsContainer, data) => {
			tagsContainer.innerHTML = '';
			let search = [];
			if(input.value.length > 2) {
				data.forEach(dataValue => {
					if(dataValue.includes(input.value.toLowerCase())) {
						search.push(dataValue);
					}
				});
				if(search.length === 0) {
					tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase()}</li>`;
				}
				else {
					search.forEach(value => {
						tagsContainer.innerHTML += `<li class='tag'>${value.charAt(0).toUpperCase() + value.slice(1)}</li>`;
					});
				}
			} else {
				data.forEach(dataValue => {
					tagsContainer.innerHTML += `<li class='tag'>${dataValue.charAt(0).toUpperCase() + dataValue.slice(1)}</li>`;
				});
			}
			const tags = tagsContainer.querySelectorAll('li');
			tags.forEach(tag => {
				tag.addEventListener('click', async ()=> {
					const tagValue = tag.textContent.toLowerCase();
					const template = document.createElement('div');
					template.classList.add(`tag-${input.placeholder}`);
					template.innerHTML = `${tag.textContent}<i class="fa-regular fa-circle-xmark"></i>`;
					document.querySelector('.tags').appendChild(template);
					document.querySelector('.recipes').innerHTML = '';
					let tagValues = await this.filter.checkValue(tagValue);
					console.log(tagValues);
					
					tagValues.forEach(value => {
						const ingredientsIncludeSearchedValue = value.recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tagValue));
						if(value.recipe.appliance.includes(tagValue) || value.recipe.description.includes(tagValue) || ingredientsIncludeSearchedValue){
							tagValues.push(new RecipeCard(tagValue));
						}						
					});
					// tagValues.reduce((previousValue, currentValue) => {
					// 	console.log(previousValue);
					// 	if(tagValues.includes(currentValue && previousValue)){
					// 		tagValues.push(currentValue);
					// 	}
					// }, '');

					// fermer le tag en cliquant sur l'icon X
					const closeIcon = template.querySelector('i');
					closeIcon.addEventListener('click', () => {
						closeIcon.parentElement.remove();
					});
				});
			});
		};
		
		renderValuesAndBindEvent(ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput, ingredientsIcon);
		renderValuesAndBindEvent(appareils, appareilsTagsContainer, appareilsFilter, appareilsInput, appareilsIcon);
		renderValuesAndBindEvent(ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput, ustencilesIcon);

	}
	
}
