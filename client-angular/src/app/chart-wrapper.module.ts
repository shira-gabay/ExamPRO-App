import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartWrapperComponent } from './chart-wrapper.component';

@NgModule({
  declarations: [ChartWrapperComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [ChartWrapperComponent]
})
export class ChartWrapperModule {}
