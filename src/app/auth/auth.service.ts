import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private signUpUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey;
  private signInUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey;

  user = new BehaviorSubject<User>(null);
  private tokenExprationTimer;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(this.signUpUrl, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(this.signInUrl, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): void {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);

    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse): Observable<any> {
    let errMsg = 'An unknown error occurred';

    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errMsg);
    }
    console.log(errorResp);
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
    return throwError(errMsg);
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExprationTimer) {
      clearTimeout(this.tokenExprationTimer);
      this.tokenExprationTimer = null;
    }
  }

  autoLogin(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const exprationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(exprationDuration);
    }
  }

  autoLogout(exprationDuration: number): void {
    this.tokenExprationTimer = setTimeout(() => {
      this.logout();
    }, exprationDuration);
  }
}
