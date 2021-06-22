import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{
    email: string;
    id: string;
    token: string;
    expirationDate: Date;
  }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{
    email: string;
    password: string;
  }>()
);

export const logout = createAction('[Auth] Logout');
