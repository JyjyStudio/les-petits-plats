import RecipesApi from '../Api/Api.js';
import RecipeCard from '../templates/RecipeCard.js';

export default class Tag {
	constructor() {
		this.data = new Set();
		this.cardWrapper = document.querySelector('main .recipes');
		this.searchBar = document.getElementById('search');

		this.filteredLabels = {
			ingredients: new Set(),
			appareils: new Set(),
			ustensiles: new Set()
		};

		this.currentTags = {
			ingredients : [],
			appliances : [], 
			ustensils : []
		};

		// this.currentRecipes = new Set();
		// this.currentIndex = new Set();
	}

	async filterTags() {
		const data = await new RecipesApi('data/recipes.json').getRecipes();
		//Envoi toutes les recette en globlal dans this.data
		data.forEach(recipe => {
			this.data.add(recipe);
		});
		// parcours la data et ajoute à this.filteredLabels chaque ingrédient, appareil, ustensile
		[...this.data].forEach(recipe => {
			recipe.appliance ? this.filteredLabels.appareils.add(recipe.appliance.toLowerCase()) : '';
			recipe.ingredients.forEach(ingredient => this.filteredLabels.ingredients.add(ingredient.ingredient.toLowerCase()));
			recipe.ustensils.forEach(ustensil => this.filteredLabels.ustensiles.add(ustensil.toLowerCase()));
		});
		
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
		 * Gère les evenements liés aux inputs et tags
		 * @param {Array} data - Tableau d'objets qui contient toute la data qui provient du fichier json 
		 * @param {HTMLElement} tagsContainer - Container des tags
		 * @param {HTMLElement} filter - Container global de chaque filtre
		 * @param {HTMLElement} input - Input de chaque filtre
		 * @param {HTMLElement} icon - Icone à droite de l'input qui permet d'ouvrir ou de fermer la liste des tags
		 */
		const listenInput = (data, tagsContainer, filter, input, icon) => {
			// l'input s'ouvre en cliquant sur çelui-ci 
			input.addEventListener('focus', () => {
				filter.classList.add('selected');
				input.classList.add('selected');
				tagsContainer.classList.add('selected');
				clearLabels();
				show_filter_TagList(input, tagsContainer, data);
				renderTag_filterRecipes(input, tagsContainer);
			});

			// lorsque l'input est ouvert, il se ferme en cliquant en dehors
			window.addEventListener('click', () => deselect(filter, input, tagsContainer));

			// gestion des tab
			window.addEventListener('keyup', event => (event.key == 'Tab') ? deselect(filter, input, tagsContainer) : '');

			// en cliquant sur l'icone chevron, l'input s'ouvre ou se ferme
			icon.addEventListener('click', ()=> {
				filter.classList.toggle('selected');
				input.classList.toggle('selected');
				tagsContainer.classList.toggle('selected');
				input.classList.contains('selected') ? input.focus() : '';
			});
			
			// compare les mots recherchés et affiche les tags par rapport à ces mots clés
			input.addEventListener('input', () => {
				clearLabels();
				show_filter_TagList(input, tagsContainer, data);
				renderTag_filterRecipes(input, tagsContainer);
			});
		};
		
		const clearLabels = () => {
			this.filteredLabels = {
				ingredients: new Set(),
				appareils: new Set(),
				ustensiles: new Set()
			};
		};

		const deselect = (filter, input, tagsContainer) => {
			if (document.activeElement !== input) {
				filter.classList.remove('selected');
				input.classList.remove('selected');
				tagsContainer.classList.remove('selected');
				input.value = '';
			}
		};

		// affiche les tags en fonction des mots qui sont recherchés dans la barre de recherche principale, et affine la liste des tags avec les mots recherchés dans les filtres avancés
		const show_filter_TagList = (input, tagsContainer) => {

			tagsContainer.innerHTML = '';
			const searchbarValue = this.searchBar.value.toLowerCase();
			const searchtagValue = input.value.toLowerCase();
			let filteredRecipesBySearchbar = new Set();
			let filteredTagsBySearchtag = new Set();

			// filteredRecipesBySearchbar contient toutes les recettes si aucun mot clé recherché
			[...this.data].forEach(recipe => filteredRecipesBySearchbar.add(recipe));

			// on filtre les recettes en fonction du mot recherché dans la barre de recherche
			filteredRecipesBySearchbar = [...filteredRecipesBySearchbar].filter(recipe => recipe.name.toLowerCase().includes(searchbarValue) 
				|| recipe.appliance.toLowerCase().includes(searchbarValue) 
				|| recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(searchbarValue)) 
				|| recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchbarValue))
			);
			
			if(filteredRecipesBySearchbar.length) {
				switch (tagsContainer.id) {
				case 'labels-ingredients':
					filteredRecipesBySearchbar.forEach(recipe => {
						recipe.ingredients.forEach(ingredient => {
							this.filteredLabels.ingredients.add(ingredient.ingredient.toLowerCase());
							[...this.filteredLabels.ingredients].forEach(ingredient => ingredient.includes(searchtagValue) ? filteredTagsBySearchtag.add(ingredient) : '');
						});
					});
					if([...filteredTagsBySearchtag].length) {
						filteredTagsBySearchtag.forEach(ingredient => {
							tagsContainer.innerHTML += `<li class='tag'>${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</li>`;
						});
						tagsContainer.classList.remove('not-found');
					} else {
						tagsContainer.classList.add('not-found');
						tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase().slice(0, -1)} ne correspond à votre recherche.</li>`;
					}
					break;
				case 'labels-appareils':
					filteredRecipesBySearchbar.forEach(recipe => {
						this.filteredLabels.appareils.add(recipe.appliance.toLowerCase());
						this.filteredLabels.appareils.forEach(appliance => appliance.includes(searchtagValue) ? filteredTagsBySearchtag.add(appliance) : '');
					});
					if([...filteredTagsBySearchtag].length) {
						this.filteredLabels.appareils.forEach(appliance => {
							tagsContainer.innerHTML += `<li class='tag'>${appliance.charAt(0).toUpperCase() + appliance.slice(1)}</li>`;
						});
						tagsContainer.classList.remove('not-found');
					} else {
						tagsContainer.classList.add('not-found');
						tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase().slice(0, -1)} ne correspond à votre recherche.</li>`;
					}
					break;
				case 'labels-ustensiles':
					filteredRecipesBySearchbar.forEach(recipe => {
						recipe.ustensils.forEach(ustensile => {
							this.filteredLabels.ustensiles.add(ustensile.toLowerCase());
							[...this.filteredLabels.ustensiles].forEach(ustensile => ustensile.includes(searchtagValue) ? filteredTagsBySearchtag.add(ustensile) : '');
						});
					});
					if([...filteredTagsBySearchtag].length) {
						filteredTagsBySearchtag.forEach(ustensile => {
							tagsContainer.innerHTML += `<li class='tag'>${ustensile.charAt(0).toUpperCase() + ustensile.slice(1)}</li>`;
						});
						tagsContainer.classList.remove('not-found');
					} else {
						tagsContainer.classList.add('not-found');
						tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase().slice(0, -1)} ne correspond à votre recherche.</li>`;
					}
					break;
				default:
					console.log('type de label inexistant');
					break;
				}
			} else {
				tagsContainer.classList.add('not-found');
				tagsContainer.innerHTML = `<li class='tag'>Aucun ${input.placeholder.toLowerCase().slice(0, -1)} ne correspond à votre recherche.</li>`;
			}
		};


		const renderTag_filterRecipes = (input, tagsContainer) => {
			const tagsList = tagsContainer.querySelectorAll('li');
			tagsList.forEach(tagElement => {
				tagElement.addEventListener('click', () => {
					// on ajoute à this.currentTags le tag recherché et on l'affiche
					this.addCurrentTags(input.placeholder, tagElement.textContent);
					console.log('%cThis.currentTags', 'color: blue', this.currentTags);
					// on vide les résultats et récupère la valeur du mot clé recherché
					document.querySelector('.recipes').innerHTML = '';
					// non terminé : on filtre les résultats en fonction du/des mot(s) clé(s) + tag(s)
					checkTagsValue_FilterRecipes();
				});
			});
		};
		
		// Vérifie dans chaque recette si le mot recherché est contenu dans la recette, et retourne template (le tableau filtré)
		const checkTagsValue_FilterRecipes = () => {
			const filteredResult = [...this.data].reduce((matchRecipes, currentRecipe) => {

				Object.keys(this.currentTags).reduce((acc, currentTagCategory) => {
					// console.log(currentTagCategory);
					let matchIngredients, matchAppliances, matchUstensils;
					// console.log(acc);
					switch (currentTagCategory) {
					case 'ingredients':
						this.currentTags.ingredients.map((currentTagIngredient) => {
							currentRecipe.ingredients.map(currentRecipeIngredient => {
								if (currentRecipeIngredient.ingredient.toLowerCase() == currentTagIngredient.toLowerCase()) {
									matchIngredients = true;
								}
							});
						});
						break;
					case 'appliances':
						this.currentTags.appliances.map((currentTagAppliance) => {
							if (currentRecipe.appliance == currentTagAppliance) {
								matchAppliances = true;
							}
						});
						break;
					case 'ustensils':
						this.currentTags.ustensils.map((currentTagUstensil) => {
							currentRecipe.ustensils.map((currentRecipeUstensil) => {
								if (currentRecipeUstensil.toLowerCase() == currentTagUstensil) {
									matchUstensils = true;
								}
							});
						});
						break;
					}
					// console.log(matchIngredients && matchAppliances && matchUstensils);
					if(matchIngredients ?? matchAppliances ?? matchUstensils) {
						if(matchRecipes.includes(currentRecipe)) { //pour eviter les doublons
							return;
						} else {
							// console.error('all Match');
							matchRecipes.push(currentRecipe);
							return matchRecipes;
						}
					}
					return acc;
				}, []);
				
				return matchRecipes;
				
			}, []);
			this.cardWrapper.innerHTML = '';
			let template = filteredResult.map(el=>new RecipeCard(el));
			if(template.length == 0) {
				this.cardWrapper.textContent = 'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc..';
			} else {
				template.forEach(el => {
					this.cardWrapper.appendChild(el.createCard());
				});
			}
			console.log('%cFilteredResult', 'color : blue', filteredResult);
			// let template = [...this.data].filter(recipe => {
			// 	if(recipe.name.toLowerCase().includes(tagValue) 
			// 	|| recipe.appliance.toLowerCase().includes(tagValue) 
			// 	|| recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tagValue)) 
			// 	|| recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tagValue))) {
			// 		this.currentIndex.add((recipe.id)-1);
			// 		return true;
			// 	} else return false;
			// });

			// // console.log(this.currentIndex, this.data);
			// [...this.currentIndex].forEach(id => this.currentRecipes.add([...this.data][id]));
			// console.log(template, this.currentRecipes);
			// template = [...this.currentRecipes].map(el => new RecipeCard(el));
		
			// // efface les recettes présentes puis: si le tableau de correspondance est vide => affiche 'aucun résultat trouvé.', sinon affiche les resultats trouvé via RecipeCard.createCard()
			// this.cardWrapper.innerHTML = '';
	
			// if(template.length == 0) {
			// 	this.cardWrapper.textContent = 'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc..';
			// } else {
			// 	template.forEach(el => {
			// 		this.cardWrapper.appendChild(el.createCard());
			// 	});
			// }
			// return template;
		};
		
		listenInput(this.filteredLabels.ingredients, ingredientsTagsContainer, ingredientsFilter, ingredientsInput, ingredientsIcon);
		listenInput(this.filteredLabels.appareils, appareilsTagsContainer, appareilsFilter, appareilsInput, appareilsIcon);
		listenInput(this.filteredLabels.ustensiles, ustensilesTagsContainer, ustensilesFilter, ustensilesInput, ustensilesIcon);
	}

	addCurrentTags = (currentInputPlaceholder, tagContent) => {
		let category;
		switch (currentInputPlaceholder) {
		case 'Ingrédients':
			category = 'ingredients';
			break;
		case 'Appareils':
			category = 'appliances';
			break;
		case 'Ustensiles':
			category = 'ustensils';
			tagContent = tagContent.toLowerCase();
			break;
		default:
			break;
		}
		if(this.currentTags[category].includes(tagContent)) {
			return;
		} else {
			this.currentTags[category].push(tagContent);
			//on crée le tag et on l'affiche, il ne s'affichera qu'une seule fois
			const tag = document.createElement('div');
			tag.classList.add(`tag-${currentInputPlaceholder}`);
			tag.innerHTML = `${tagContent}<i class="fa-regular fa-circle-xmark"></i>`;
			document.querySelector('.tags').appendChild(tag);
			// on retire le tag en cliquant sur l'icon X
			const closeIcon = tag.querySelector('i');
			closeIcon.addEventListener('click', () => {
				closeIcon.parentElement.remove();
				// console.log(this.currentTags[category]);
				this.currentTags[category].splice(0, this.currentTags[category].length);
				console.log('%cThis.currentTags', 'color: blue', this.currentTags);
			});

		}
	};
}
