import RecipesApi from './Api/Api.js';
import RecipeCard from './templates/RecipeCard.js';

class App {
	constructor() {
		this.cardWrapper = document.querySelector('main .recipes');
		this.recipesApi = new RecipesApi('data/recipes.json');
	}

	async main() {
		const recipesData = await this.recipesApi.getRecipes();
		recipesData.forEach(recipe => {
			const Template = new RecipeCard(recipe);
			this.cardWrapper.appendChild(Template.createCard()); 
		});
	}
}

const app = new App();
app.main();
