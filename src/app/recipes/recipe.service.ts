import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Ratatouille',
  //     'Ratatouille is a French stewed vegetable dish',
  //     'https://www.liveeatlearn.com/wp-content/uploads/2017/01/ratatouille-vegetable-tian-6-650x851.jpg',
  //     [
  //       new Ingredient('Zucchini', 2),
  //       new Ingredient('Eggplant', 3),
  //       new Ingredient('Roma Tomatoes', 10),
  //     ]
  //   ),
  //   new Recipe(
  //     'Pav Bhaji',
  //     'Pav bhaji is a fast food dish from India.',
  //     'https://s9c2c8i7.rocketcdn.me/wp-content/uploads/2020/12/pav-bhaji-2020.jpg',
  //     [
  //       new Ingredient('Potatoes', 3),
  //       new Ingredient('Carrot', 2),
  //       new Ingredient('Capsicum', 4),
  //       new Ingredient('Tomatoes', 5),
  //     ]
  //   ),
  // ];
  recipesChanged = new Subject<Recipe[]>();

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(recipes.slice());
  }

  updateRecipe(index: number, updatedRecipe: Recipe): void {
    this.recipes[index] = updatedRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
