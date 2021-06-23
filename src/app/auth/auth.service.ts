import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExprationTimer;

  constructor(private store: Store<fromApp.AppState>) {}

  /**
   * Sets the timeout
   * @param exprationDuration: in ms
   */
  setLogoutTimer(exprationDuration: number): void {
    this.tokenExprationTimer = setTimeout(() => {
      this.store.dispatch(authActions.logout());
    }, exprationDuration);
  }

  clearLogoutTimer(): void {
    if (this.tokenExprationTimer) {
      clearTimeout(this.tokenExprationTimer);
      this.tokenExprationTimer = null;
    }
  }
}
