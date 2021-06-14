import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth Page] Login',
  props<{
    email: string;
    id: string;
    token: string;
    expirationDate: Date;
  }>()
);

export const logout = createAction('[Auth Page] Logout');
