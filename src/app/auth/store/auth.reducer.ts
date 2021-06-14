import { Action, createReducer, on } from '@ngrx/store';
import { User } from './../user.model';
import * as authActions from './auth.actions';

export interface State {
  user: User;
}

const initialState: State = {
  user: null,
};

const reducer = createReducer(
  initialState,

  on(authActions.login, (state, payload) => {
    const newUser = new User(
      payload.email,
      payload.id,
      payload.token,
      payload.expirationDate
    );
    return {
      ...state,
      user: newUser,
    };
  }),

  on(authActions.logout, (state) => {
    return {
      ...state,
      user: null,
    };
  })
);

export function authReducer(state: State | undefined, action: Action): State {
  return reducer(state, action);
}
