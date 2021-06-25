import { createAction, props } from '@ngrx/store';

export const authSuccess = createAction(
  '[Auth] Login',
  props<{
    email: string;
    id: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{
    email: string;
    password: string;
  }>()
);

export const authFail = createAction(
  '[Auth] Login Fail',
  props<{
    errorMsg: string;
  }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    email: string;
    password: string;
  }>()
);

export const autoLogin = createAction('[Auth] Auto Login');

export const clearError = createAction('[Auth] Clear Error');

export const logout = createAction('[Auth] Logout');
