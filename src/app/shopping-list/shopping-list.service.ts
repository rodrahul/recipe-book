import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

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

  constructor(private store: Store<fromShoppingList.AppState>) {}

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient): void {
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  addIngredients(newIngredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(newIngredients));
  }

  updateIngredient(newIngredient: Ingredient): void {
    this.store.dispatch(
      new ShoppingListActions.UpdateIngredient(newIngredient)
    );
  }

  deleteIngredient(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
  }
}
