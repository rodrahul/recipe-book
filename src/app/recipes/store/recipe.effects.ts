import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  private url =
    'https://ng-complete-guide-c3aef-default-rtdb.firebaseio.com/recipes.json';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(this.url).pipe(
          filter((recipes) => recipes !== null),
          map((recipes) => {
            return recipes.map((recipe) => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              };
            });
          }),

          map((recipes) => {
            return RecipesActions.setRecipes({ recipes });
          })
        );
      })
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipeState]) => {
          return this.http.put(this.url, recipeState.recipes);
        })
      ),
    { dispatch: false }
  );
}

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
