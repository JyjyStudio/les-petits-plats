import RecipeCard from './../templates/RecipeCard.js';
import RecipesApi from '../Api/Api.js';

export default class Filter {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.cardWrapper = document.querySelector('main .recipes');
		this.getValueFromSearchBar = this.getValueFromSearchBar();
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
	
	getValueFromSearchBar() {
		const form = document.getElementById('search-form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.cardWrapper.innerHTML = '';
			this.checkValue();
		});

		const searchInput = document.querySelector('form .search-bar');
		searchInput.addEventListener('keyup', (e) => {
			console.time('search');
			
			const searchValue = searchInput.value;
			
			if(e.keyCode !== 13 && searchValue.length >=3) {
				this.checkValue();
			}else {
				this.displayAllRecipes();
			}

			console.timeEnd('search');
		});
	}

	async checkValue() {
		const recipes = await this.data;
		const searchedValue = document.querySelector('form .search-bar').value.toLowerCase();
		let Template = [];

		// Vérifie dans chaque recette si le mot recherché est contenu dans la recette, si oui remplit le tableau Template
		for (let index = 0; index < recipes.length; index++) {
			const recipe = recipes[index];
			const name = recipe.name.toLowerCase();
			const description = recipe.description.toLowerCase();
			const ingredients = recipe.ingredients;

			const nameIncludeSearchedValue = name.includes(searchedValue);
			const descriptionIncludeSearchedValue = description.includes(searchedValue);
			const ingredientsIncludeSearchedValue = ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchedValue));

			if(nameIncludeSearchedValue || descriptionIncludeSearchedValue || ingredientsIncludeSearchedValue) {
				Template.push(new RecipeCard(recipe));
			}
		}
		// efface les recettes présentes puis: si le tableau de correspondance est vide => affiche 'aucun résultat trouvé.', sinon affiche les resultats trouvé via RecipeCard.createCard()
		this.cardWrapper.innerHTML = '';
		if(Template.length == 0) {
			this.cardWrapper.textContent = 'aucun résultat trouvé';
		} else {
			Template.forEach(template => {
				this.cardWrapper.appendChild(template.createCard());
			});
		}
	}

	// Focus sur le champs de recherche en arrivant sur la page
	focusOnload() {
		window.addEventListener('load', () => {
			const searchInput = document.querySelector('form .search-bar');
			searchInput.focus();
		});
	}
	
}
