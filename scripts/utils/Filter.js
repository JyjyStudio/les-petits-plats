// import CardFactory from '../factories/CardFactory.js';
import RecipeCard from './../templates/RecipeCard.js';
import RecipesApi from '../Api/Api.js';

export default class Filter {
	constructor() {
		this.data = new RecipesApi('data/recipes.json').getRecipes();
		this.cardWrapper = document.querySelector('main .recipes');
		this.getValueFromSearchBar = this.getValueFromSearchBar();
		this.focusOnload = this.focusOnload();
	}
	
	getValueFromSearchBar() {
		const searchInput = document.querySelector('form .search-bar');
		searchInput.addEventListener('keyup', (e) => {
			console.log(e.currentTarget.value);
			if(e.keyCode !== 13) {	// touche entrée 
				this.cardWrapper.innerHTML = '';
				this.checkValue();
			}
		});
		
		const form = document.getElementById('search-form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.cardWrapper.innerHTML = '';
			this.checkValue();
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

			if(name.includes(searchedValue) || description.includes(searchedValue) || ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchedValue))) {
				Template.push(new RecipeCard(recipe));
			}
		}
		// si le tableau de correspondance est vide => message, sinon affiche les resultats via RecipeCard.createCard()
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
