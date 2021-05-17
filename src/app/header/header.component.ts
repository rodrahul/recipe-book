import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private dataStore: DataStorageService) {}

  onSaveData(): void {
    this.dataStore.storeRecipes();
  }

  onFetchData(): void {
    this.dataStore.fetchRecipes().subscribe();
  }
}
