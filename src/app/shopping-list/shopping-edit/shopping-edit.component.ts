import { Ingredient } from './../../shared/ingredient.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @Output() itemAdded = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onAdd(itemName: HTMLInputElement, itemAmount: HTMLInputElement): void {
    const newIngredient = new Ingredient(itemName.value, Number(itemAmount.value));
    this.itemAdded.emit(newIngredient);
  }

}
