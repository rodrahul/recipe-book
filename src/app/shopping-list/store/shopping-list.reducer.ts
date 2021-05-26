import { Ingredient } from '../../shared/ingredient.model';
import * as slActions from './shopping-list.actions';

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State = initialState,
  action: slActions.ShoppingListActions
) {
  switch (action.type) {
    case slActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };

    case slActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case slActions.UPDATE_INGREDIENT:
      const ingToUpdate = state.ingredients[state.editedIngredientIndex];
      const updatedIng = {
        ...ingToUpdate,
        ...action.payload,
      };
      const updatedIngs = [...state.ingredients];
      updatedIngs[state.editedIngredientIndex] = updatedIng;
      return {
        ...state,
        ingredients: updatedIngs,
        editedIngredientIndex: -1,
        editedIngredien: null,
      };

    case slActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1,
        editedIngredien: null,
      };

    case slActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };

    case slActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };

    default:
      // For action action@ngrx/store/init
      console.log('Default action' + action);
      return state;
  }
}
