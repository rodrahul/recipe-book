import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAB7Rg5bWbkGrTUjzo8f3d3FSnfdZqaRLA';
  private signInUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAB7Rg5bWbkGrTUjzo8f3d3FSnfdZqaRLA';

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(this.signUpUrl, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(this.signInUrl, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError));
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
}
