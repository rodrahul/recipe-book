import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authSuccess({
    email,
    id: userId,
    token,
    expirationDate,
  });
};

const handleError = (errorResp: HttpErrorResponse) => {
  let errMsg = 'An unknown error occurred';

  if (!errorResp.error || !errorResp.error.error) {
    return of(
      AuthActions.authFail({
        errorMsg: errMsg,
      })
    );
  }

  switch (errorResp.error.error.message) {
    case 'EMAIL_EXISTS':
      errMsg = 'Email address already exists';
      break;
    case 'INVALID_PASSWORD':
      errMsg = 'Username/Password is invalid';
      break;
    case 'EMAIL_NOT_FOUND':
      errMsg = 'Username/Password is invalid';
      break;
  }

  return of(
    AuthActions.authFail({
      errorMsg: errMsg,
    })
  );
};

@Injectable()
export class AuthEffects {
  private signUpUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
    environment.firebaseAPIKey;
  private signInUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
    environment.firebaseAPIKey;

  /**
   * Effect for type loginStart, dispatches authSuccess on successful login.
   * and authFail for failed login.
   */
  @Effect()
  authLogin$ = this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap((actions) => {
      console.log('AuthSuccess$ LoginStart Effect');
      return this.http
        .post<AuthResponseData>(this.signInUrl, {
          email: actions.email,
          password: actions.password,
          returnSecureToken: true,
        })
        .pipe(
          tap((respData) =>
            this.authService.setLogoutTimer(+respData.expiresIn)
          ),
          map((respData) => {
            return handleAuthentication(
              respData.email,
              respData.localId,
              respData.idToken,
              respData.expiresIn
            );
          }),
          catchError((errorResp) => {
            return handleError(errorResp);
          })
        );
    })
  );

  /**
   * Effect which does not dispatch actions, we just navigate to ./ on successful login
   */
  // @Effect({ dispatch: false })
  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authSuccess),
        tap(() => {
          this.router.navigate(['./']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Effect for signupStart action
   */
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupAction) => {
        return this.http
          .post<AuthResponseData>(this.signUpUrl, {
            email: signupAction.email,
            password: signupAction.password,
            returnSecureToken: true,
          })
          .pipe(
            tap((respData) =>
              this.authService.setLogoutTimer(+respData.expiresIn * 1000)
            ),
            map((respData) => {
              return handleAuthentication(
                respData.email,
                respData.localId,
                respData.idToken,
                respData.expiresIn
              );
            }),
            catchError((errorResp) => {
              return handleError(errorResp);
            })
          );
      })
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const exprationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(exprationDuration);
          return handleAuthentication(
            loadedUser.email,
            loadedUser.id,
            loadedUser.token,
            userData._tokenExpirationDate
          );
        }
      })
    )
  );

  authLoout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
