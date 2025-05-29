import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { KpiCardsComponent } from '../dashboard/kpi-cards.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, KpiCardsComponent],
  template: `
    <mat-tab-group>
      <mat-tab label="לפי מורים">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">סטטיסטיקות לפי מורים</h2>
          <app-kpi-cards></app-kpi-cards>
        </div>
      </mat-tab>
      <mat-tab label="לפי מקצועות">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">סטטיסטיקות לפי מקצועות</h2>
          <app-kpi-cards></app-kpi-cards>
        </div>
      </mat-tab>
      <mat-tab label="לפי זמן">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">סטטיסטיקות לפי זמן</h2>
          <app-kpi-cards></app-kpi-cards>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: []
})
export class DashboardComponent {}
