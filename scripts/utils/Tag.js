import RecipesApi from '../Api/Api.js';
import RecipeCard from '../templates/RecipeCard.js';
import Filter from './Filter.js';

export default class Tag {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.cardWrapper = document.querySelector('main .recipes');
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
		const ustensilesIcon = filterIcons[2];

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
		 * @param {Array} data - tableau de données à traiter
		 */
		const styliseInputOnClick = (filter, input, tagsContainer, icon, data) => {
			// l'input s'ouvre en cliquant sur çelui ci 
			input.addEventListener('focus', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
				filterTagList(input, tagsContainer, data);
				filterContentByTag(input, tagsContainer);
			});
			// lorsque l'input est ouvert, il se ferme en cliquant en dehors
			window.addEventListener('click', () => {
				if (document.activeElement !== input) {
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
			input.addEventListener('input', async () => {
				filterTagList(input, tagsContainer, data);
				filterContentByTag(input, tagsContainer);
			});
		};

		//affiche les tags en fonction des mots qui sont insérés dans l'input
		const filterTagList = (input, tagsContainer, data) => {
			tagsContainer.innerHTML = '';

			let filteredSearch = [...data].filter(dataValue => dataValue.includes(input.value.toLowerCase().trim()) );

			if(filteredSearch.length === 0) {
				tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase()}</li>`;
			} else {
				filteredSearch.forEach(value => {
					tagsContainer.innerHTML += `<li class='tag'>${value.charAt(0).toUpperCase() + value.slice(1)}</li>`;
				});
			}
		};

		const filterContentByTag = (input, tagsContainer) => {
			const tagsList = tagsContainer.querySelectorAll('li');
			tagsList.forEach(tagElement => {
				tagElement.addEventListener('click', async () => {
					renderTag(input, tagElement);
					document.querySelector('.recipes').innerHTML = '';
					const tagValue = tagElement.textContent.toLowerCase();
					
					let filteredDataByTagValues = await checkTagsValue(tagValue);
					console.log(filteredDataByTagValues);
					
					filteredDataByTagValues.forEach(value => {
						const ingredientsIncludeSearchedValue = value.recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tagValue));
						if(value.recipe.appliance.includes(tagValue) || value.recipe.description.includes(tagValue) || ingredientsIncludeSearchedValue){
							filteredDataByTagValues.push(new RecipeCard(tagValue));
						}						
					});
					
				});
			});
		};

		const renderTag = (input, tagElement) => {
			const tag = document.createElement('div');
			tag.classList.add(`tag-${input.placeholder}`);
			tag.innerHTML = `${tagElement.textContent}<i class="fa-regular fa-circle-xmark"></i>`;
			document.querySelector('.tags').appendChild(tag);
			// fermer le tag en cliquant sur l'icon X
			const closeIcon = tag.querySelector('i');
			closeIcon.addEventListener('click', () => {
				closeIcon.parentElement.remove();
			});
		};

		const  checkTagsValue = async (searchedValue) => {
			const recipes = await this.data;
			// Vérifie dans chaque recette si le mot recherché est contenu dans la recette, et retourne template (le tableau filtré)
			let template = recipes.filter(recipe => 
				recipe.name.toLowerCase().includes(searchedValue) 
				|| recipe.appliance.toLowerCase().includes(searchedValue) 
				|| recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(searchedValue)) 
				|| recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchedValue)) 
			);
			
			template = template.map(el => new RecipeCard(el));
		
			// efface les recettes présentes puis: si le tableau de correspondance est vide => affiche 'aucun résultat trouvé.', sinon affiche les resultats trouvé via RecipeCard.createCard()
			this.cardWrapper.innerHTML = '';
	
			if(template.length == 0) {
				this.cardWrapper.textContent = 'aucun résultat trouvé';
			} else {
				template.forEach(el => {
					this.cardWrapper.appendChild(el.createCard());
				});
			}
			
			return template;
		};
		
		renderValuesAndBindEvent(ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput, ingredientsIcon);
		renderValuesAndBindEvent(appareils, appareilsTagsContainer, appareilsFilter, appareilsInput, appareilsIcon);
		renderValuesAndBindEvent(ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput, ustensilesIcon);

	}
	
}
