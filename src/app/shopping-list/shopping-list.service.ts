import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.store';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  constructor(
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient): void {
    // this.ingredients.push(ingredient);
    // this.ingredientsChanged.next(this.ingredients.slice());
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  addIngredients(newIngredients: Ingredient[]): void {
    // this.ingredients.push(...newIngredients)
    // this.ingredientsChanged.next(this.ingredients.slice())
    this.store.dispatch(new ShoppingListActions.AddIngredients(newIngredients));
  }

  updateIngredient(index: number, newIngredient: Ingredient): void {
    // this.ingredients[index] = newIngredient
    // this.ingredientsChanged.next(this.ingredients.slice())
    this.store.dispatch(
      new ShoppingListActions.UpdateIngredient({ index, newIngredient })
    );
  }

  deleteIngredient(index: number): void {
    // this.ingredients.splice(index, 1)
    // this.ingredientsChanged.next(this.ingredients.slice())
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(index));
  }
}
