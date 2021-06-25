import { Action, createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as recipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

const reducer = createReducer(
  initialState,

  on(recipeActions.setRecipes, (state, payload) => {
    return {
      ...state,
      recipes: [...payload.recipes],
    };
  }),

  on(recipeActions.addRecipe, (state, payload) => {
    return {
      ...state,
      recipes: [...state.recipes, payload.recipe],
    };
  }),

  on(recipeActions.updateRecipe, (state, payload) => {
    const recipeToUpdate = {
      ...state.recipes[payload.index],
      ...payload.recipe,
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[payload.index] = recipeToUpdate;
    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),

  on(recipeActions.deleteRecipe, (state, payload) => {
    // Filter always returns a new list, so we do not mutate
    return {
      ...state,
      recipes: state.recipes.filter((recipe, index) => {
        return index !== payload.index;
      }),
    };
  })
);

export function recipesReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
