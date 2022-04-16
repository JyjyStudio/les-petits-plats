export default class RecipeCard {
	constructor(card) {
		this.card = card;
		this.$wrapper = document.createElement('div');
		this.$wrapper.classList.add('recipe-card-wrapper');
	}

	createCard() {

		const recipeCard = `<div class="recipe-thumbnail center">
                                <img src="https://picsum.photos/200"  alt="${this.card.name}"/>
                            </div>
                            <h3 class="fs-16 center">${this.card.name}</h3>
                            <p class="fs-14 center">
                                <span>${this.card.ingredients}</span>
                                -
                                <span>${this.card.description}</span>
                            </p>`;
        
		this.$wrapper.innerHTML = recipeCard;
		return this.$wrapper;
	}
	get recipe() {
		return this.card;
	}
}
