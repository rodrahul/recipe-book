import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';

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
    private recipeService: RecipeService
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
      const recipe = this.recipeService.getRecipe(this.id);
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
    // const recipe = new Recipe(
    //   this.recipeForm.get('name').value,
    //   this.recipeForm.get('description').value,
    //   this.recipeForm.get('imagePath').value,
    //   this.recipeForm.get('ingredients').value
    // )
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigate(['/recipes', this.id]);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
      this.router.navigate(['/recipes']);
    }
    console.log(this.recipeForm);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route })
  }
}
