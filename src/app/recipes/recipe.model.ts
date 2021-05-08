// This model is a blueprint for how our recipes should look like
export class Recipe {

  public name: string;
  public description: string;
  public imagePath: string;

  constructor(name: string, des: string, imagePath: string) {
    this.name = name;
    this.description = des;
    this.imagePath = imagePath;
  }
}
