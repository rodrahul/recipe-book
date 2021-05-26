import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { Ingredient } from './../../shared/ingredient.model';
import { ShoppingListService } from './../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  startEditSub: Subscription;
  editMode = false;
  editItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    this.startEditSub = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.startEditSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onAddEditItem(form: NgForm): void {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(): void {
    this.shoppingListService.deleteIngredient();
    this.onClear();
  }
}
