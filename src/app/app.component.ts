import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  navigateTo = 'recipe';

  onNavigate(navigateTo: string): void {
    this.navigateTo = navigateTo;
  }
}
