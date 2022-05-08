import RecipeCard from './../templates/RecipeCard.js';
import RecipesApi from '../Api/Api.js';

export default class Filter {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.cardWrapper = document.querySelector('main .recipes');
		this.getCompareValueFromSearchBar = this.getCompareValueFromSearchBar();
		this.focusOnload = this.focusOnload();
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
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const searchBarValue = document.querySelector('form .search-bar').value.toLowerCase();
			this.cardWrapper.innerHTML = '';
			this.checkValue(searchBarValue);
		});

		const searchInput = document.querySelector('form .search-bar');
		searchInput.addEventListener('input', (e) => {
			// console.time('search');
			
			const searchedValue = searchInput.value.toLowerCase();
			
			if(e.keyCode !== 13 && searchedValue.length >=3) {
				this.checkValue(searchedValue);
			}else {
				this.displayAllRecipes();
			}

			// console.timeEnd('search');
		});
	}

	async checkValue(searchedValue) {
		const recipes = await this.data;
		// Vérifie dans chaque recette si le mot recherché est contenu dans la recette, et retourne template (le tableau filtré)
		let template = recipes.filter(recipe => 
			recipe.name.toLowerCase().includes(searchedValue) 
			|| recipe.description.toLowerCase().includes(searchedValue) 
			|| recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchedValue)) 
			|| recipe.ingredients.some(ingredient => ingredient.unit ? ingredient.unit.toLowerCase().includes(searchedValue) : '') 
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
	}

	// Focus sur le champs de recherche en arrivant sur la page
	focusOnload() {
		window.addEventListener('load', () => {
			const searchInput = document.querySelector('form .search-bar');
			searchInput.focus();
		});
	}
	
}
