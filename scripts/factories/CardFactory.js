import RecipesApi from './../Api/Api.js';
import RecipeCard from './../templates/RecipeCard.js';

export default class CardFactory {

	constructor() {
		this.recipesApi = new RecipesApi('data/recipes.json');
		this.cardWrapper = document.querySelector('main .recipes');
	}

	createCards = async () => {

		const recipesData = await this.recipesApi.getRecipes();

		recipesData.forEach((recipe) => {
			const Template = new RecipeCard(recipe);
			this.cardWrapper.appendChild(Template.createCard());
		});

	};

}
