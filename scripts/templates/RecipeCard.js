export default class RecipeCard {
	constructor(recipe) {
		this.recipe = recipe;
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('recipe-card');
	}

	createCard() {

		const ingredients = this.recipe.ingredients.reduce((previousValue, currentValue) => {
			if(currentValue.quantity && currentValue.unit) {
				return `${previousValue}<p class='ingredient'>${currentValue.ingredient} : ${currentValue.quantity} ${currentValue.unit}</p>`;
			} else if(currentValue.quantity) {
				return `${previousValue}<p class='ingredient'>${currentValue.ingredient} : ${currentValue.quantity}</p>`;
			}
			else {
				return `${previousValue}<p class='ingredient'>${currentValue.ingredient}</p>`;
			}
		}, '');
		
		const recipeCard = `<div class="recipe-card__thumbnail">
                                <img src="assets/thumbnail.jpg"  alt="${this.recipe.name}"/>
                            </div>
                            <div class="recipe-card__title-time">
                                <p class="recipe-card__title">${this.recipe.name}</p>
                                <p class="recipe-card__time"><i class="far fa-clock"></i><span>${this.recipe.time} min</span></p>
                            </div>
                            <div class="recipe-card__ingredients-description">
                                <div class="recipe-card__ingredients-description--ingredients">${ingredients}</div>
                                <div class="recipe-card__ingredients-description--description">${this.recipe.description}</div>
                            </div>`;
        
		this.wrapper.innerHTML = recipeCard;
		return this.wrapper;
		
	}

}
