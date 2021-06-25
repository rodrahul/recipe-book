import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesAction from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      // we need to create the form whenever our route params change
      this.initForm();
    });
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.store
        .select('recipes')
        .pipe(
          map((recipeState) => {
            return recipeState.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          recipe.ingredients.forEach((ing: Ingredient) => {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ing.name, Validators.required),
                amount: new FormControl(ing.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
              })
            );
          });
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, [
        Validators.required,
        this.urlValidator.bind(this),
      ]),
      description: new FormControl(recipeDescription),
      ingredients: recipeIngredients,
    });
  }

  urlValidator(control: FormControl): { [urlValid: string]: boolean } {
    if (control.value.search('http') !== 0) {
      return { urlValid: false };
    }
    return null;
  }

  getIngredientControl(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  addIngredient(): void {
    const control = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
    (this.recipeForm.get('ingredients') as FormArray).push(control);
  }

  removeIngredient(index: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    if (this.editMode) {
      this.store.dispatch(
        RecipesAction.updateRecipe({
          index: this.id,
          recipe: this.recipeForm.value,
        })
      );
      this.router.navigate(['/recipes', this.id]);
    } else {
      this.store.dispatch(
        RecipesAction.addRecipe({ recipe: this.recipeForm.value })
      );
      this.router.navigate(['/recipes']);
    }
    console.log(this.recipeForm);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
