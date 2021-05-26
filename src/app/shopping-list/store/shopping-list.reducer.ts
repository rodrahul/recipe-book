import { Ingredient } from '../../shared/ingredient.model';
import * as slActions from './shopping-list.store';


const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

// Reducer takes a state and action
// We perform action on the old state and return a new state
export function shoppingListReducer(
  state = initialState,
  action: slActions.ShoppingListActions
) {
  switch (action.type) {
    case slActions.ADD_INGREDIENT:
      return {
        ...state, // copy the old state
        ingredients: [...state.ingredients, action.payload], // update the  ingredients array with old ingredients + new ingredient
      };

    case slActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case slActions.UPDATE_INGREDIENT:
      const ingToUpdate = state.ingredients[action.payload.index];
      const updatedIng = {
        ...ingToUpdate,
        ...action.payload.newIngredient,
      };
      const updatedIngs = [...state.ingredients];
      updatedIngs[action.payload.index] = updatedIng;
      return {
        ...state,
        ingredients: updatedIngs,
      };

    case slActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== action.payload;
        }),
      };

    default:
      // For action action@ngrx/store/init
      console.log('Default action' + action);
      return state;
  }
}
