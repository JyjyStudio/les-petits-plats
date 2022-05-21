import RecipeCard from './../templates/RecipeCard.js';
import RecipesApi from '../Api/Api.js';
import Tag from './Tag.js';

export default class Filter {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.cardWrapper = document.querySelector('main .recipes');
		this.getCompareValueFromSearchBar = this.getCompareValueFromSearchBar();
		this.focusOnload = this.focusOnload();
		this.tags = new Tag();
	}
	
	async displayAllRecipes() {
		const recipes = await this.data;
		this.cardWrapper.innerHTML = '';

		recipes.forEach(recipe => {
			const template = new RecipeCard(recipe);
			this.cardWrapper.appendChild(template.createCard());
		});
	}
	
	getCompareValueFromSearchBar() {
		const form = document.getElementById('search-form');
		const searchBarInput = document.querySelector('form .search-bar');

		form.addEventListener('submit', (e) => {
			e.preventDefault();
		});

		searchBarInput.addEventListener('keyup', (e) => {
			// console.time('search');
			const searchedValue = searchBarInput.value.toLowerCase().trim();
			if(e.keyCode !== 13 && searchedValue.length >=3) {
				e.stopImmediatePropagation(); //évite d'executer 2 fois la ligne suivante
				this.checkSearchBarValue(searchedValue);
			} 
			if(searchedValue.length == 2 || searchedValue.length == 0) {
				e.stopImmediatePropagation();
				this.displayAllRecipes();
			}
			// console.timeEnd('search');
		});
	}

	async checkSearchBarValue(searchedValue) {
		const recipes = await this.data;
		const currentTags = this.tags.currentTags;
		console.log(currentTags);

		// Vérifie dans chaque recette si le mot recherché est contenu dans la recette, et retourne template (le tableau filtré)
		let filteredRecipes = recipes.filter(recipe => 
			recipe.name.toLowerCase().includes(searchedValue) 
			|| recipe.description.toLowerCase().includes(searchedValue) 
			|| recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchedValue)) 
			|| recipe.ingredients.some(ingredient => ingredient.unit ? ingredient.unit.toLowerCase().includes(searchedValue) : '') 
		);
		
		let template = filteredRecipes.map(el => new RecipeCard(el));
	
		// efface les recettes présentes puis: si le tableau de correspondance est vide => affiche 'aucun résultat trouvé.', sinon affiche les resultats trouvé via RecipeCard.createCard()
		this.cardWrapper.innerHTML = '';

		if(template.length == 0) {
			this.cardWrapper.innerHTML = '<p class="not-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc..</p>';
		} else {
			template.forEach(el => {
				this.cardWrapper.appendChild(el.createCard());
			});
		}
		
		return template;
	}

	// Focus sur le champs de recherche en arrivant sur la page
	focusOnload() {
		window.addEventListener('load', () => {
			const searchInput = document.querySelector('form .search-bar');
			searchInput.focus();
		});
	}
	
}
