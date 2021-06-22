import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private signUpUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
    environment.firebaseAPIKey;

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(this.signUpUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .pipe(
            map((respData) => {
              const expirationDate = new Date(
                new Date().getTime() + +respData.expiresIn * 1000
              );
              return of(
                AuthActions.login({
                  email: respData.email,
                  id: respData.localId,
                  token: respData.idToken,
                  expirationDate,
                })
              );
            }),
            catchError(() => {
              return of();
            })
          );
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
