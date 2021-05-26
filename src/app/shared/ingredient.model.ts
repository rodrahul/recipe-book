export class Ingredient {
  public name: string;
  public amount: number;

  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }

  toString(): string {
    return this.name + ': ' + this.amount;
  }
}
