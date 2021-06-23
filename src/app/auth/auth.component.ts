import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Unsubscribable } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from './../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  subs = new Set<Unsubscribable>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {
    // Empty
  }

  ngOnInit(): void {
    this.subs.add(
      this.store.select('auth').subscribe((authState) => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if (this.error) {
          this.showErrorAlert(this.error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((x) => x.unsubscribe());
  }

  onSwitch(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(
        AuthActions.loginStart({
          email,
          password,
        })
      );
    } else {
      this.store.dispatch(AuthActions.signupStart({ email, password }));
    }

    form.reset();
  }

  onHandleClose(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  private showErrorAlert(errMsg: string): void {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  }
}
