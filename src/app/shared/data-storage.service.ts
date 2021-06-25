import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import * as RecipesAction from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private url =
    'https://ng-complete-guide-c3aef-default-rtdb.firebaseio.com/recipes.json';

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.url).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),

      tap((recipes) => {
        this.store.dispatch(RecipesAction.setRecipes({ recipes }));
      })
    );
  }
}
