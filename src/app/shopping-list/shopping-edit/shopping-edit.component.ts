import { Component, OnInit } from '@angular/core';
import { Ingredient } from './../../shared/ingredient.model';
import { ShoppingListService } from './../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
  }

  onAdd(itemName: HTMLInputElement, itemAmount: HTMLInputElement): void {
    const newIngredient = new Ingredient(itemName.value, Number(itemAmount.value));
    this.shoppingListService.addIngredient(newIngredient);
  }

}
