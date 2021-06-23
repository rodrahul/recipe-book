import { Action, createReducer, on } from '@ngrx/store';
import { User } from './../user.model';
import * as authActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

const reducer = createReducer(
  initialState,

  on(authActions.authSuccess, (state, payload) => {
    const newUser = new User(
      payload.email,
      payload.id,
      payload.token,
      payload.expirationDate
    );
    return {
      ...state,
      user: newUser,
      authError: null,
      loading: false,
    };
  }),

  on(authActions.logout, (state) => {
    return {
      ...state,
      user: null,
    };
  }),

  on(authActions.loginStart, authActions.signupStart, (state) => {
    console.log('authActions.loginStart reducer');
    return {
      ...state,
      authError: null,
      loading: true,
    };
  }),

  on(authActions.authFail, (state, payload) => {
    return {
      ...state,
      user: null,
      loading: false,
      authError: payload.errorMsg,
    };
  }),

  on(authActions.clearError, (state) => {
    return {
      ...state,
      authError: null,
    };
  })
);

export function authReducer(state: State | undefined, action: Action): State {
  return reducer(state, action);
}
