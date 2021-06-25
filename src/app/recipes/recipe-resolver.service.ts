import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import * as RecipesActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  // To fetch recipes from firebase
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // If recipes are already in the store dont fetch it again
    return this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      filter((recipes) => recipes !== null),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(RecipesActions.fetchRecipes());
          return this.actions$.pipe(ofType(RecipesActions.setRecipes), take(1));
        } else {
          return of(recipes);
        }
      })
    );
  }
}
