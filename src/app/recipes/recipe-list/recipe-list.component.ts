import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('Ratatouille', 'This is simply a test', 'https://img.buzzfeed.com/video-api-prod/assets/eb44570519264864814264f7f0a5e47a/BFV13909_BakedRatatouille-ThumbTextless1080.jpg?output-format=auto&output-quality=auto'),
    new Recipe('Pav Bhaji', 'Just another desc', 'https://s9c2c8i7.rocketcdn.me/wp-content/uploads/2020/12/pav-bhaji-2020.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  selectedRecipe(recipe: Recipe): void {
    this.recipeWasSelected.emit(recipe);
  }


}
