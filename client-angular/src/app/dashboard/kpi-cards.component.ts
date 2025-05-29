import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-cards',
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div *ngFor="let card of cards" class="bg-white p-4 rounded shadow flex items-center space-x-4">
        <div class="text-blue-500 text-4xl">
          <i [class]="card.icon"></i>
        </div>
        <div>
          <p class="text-gray-500">{{ card.title }}</p>
          <p class="text-2xl font-bold">{{ card.value }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class KpiCardsComponent {
  @Input() cards = [
    { title: 'סה"כ מבחנים החודש', value: 120, icon: 'fas fa-file-alt' },
    { title: 'מבחנים עם AI', value: 35, icon: 'fas fa-robot' },
    { title: 'מקצוע עם הכי הרבה פעילות', value: 'מתמטיקה', icon: 'fas fa-book' },
    { title: 'ממוצע זמן בין מבחנים', value: '3 ימים', icon: 'fas fa-clock' },
  ];
}
