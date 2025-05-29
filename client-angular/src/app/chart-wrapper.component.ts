import { Component, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ExamService } from '../app/services/exam.service';

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <ng-container *ngIf="isBrowser">
      <div class="chart-container">
        <h2 class="chart-title">
          גרף מספר מבחנים לפי מקצוע
        </h2>
        <div class="chart-wrapper">
          <canvas baseChart
                  [type]="'bar'"
                  [data]="barChartData"
                  [options]="barChartOptions">
          </canvas>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 40px auto;
      padding: 0;
      direction: rtl;
      text-align: center;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 1s ease forwards;
    }

    .chart-title {
      font-family: 'Heebo', sans-serif;
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
      text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .chart-container:hover .chart-title {
      transform: scale(1.05);
      filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
    }

    .chart-wrapper {
      height: 450px;
      position: relative;
      z-index: 2;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.8) inset;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
      overflow: hidden;
    }

    .chart-wrapper::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transform: rotate(45deg);
      transition: transform 0.6s ease;
      opacity: 0;
    }

    .chart-container:hover .chart-wrapper {
      transform: translateY(-5px);
      box-shadow: 
        0 35px 70px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.9) inset,
        0 0 50px rgba(102, 126, 234, 0.3);
    }

    .chart-container:hover .chart-wrapper::before {
      opacity: 1;
      transform: rotate(45deg) translateX(100%);
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* רספונסיביות */
    @media (max-width: 768px) {
      .chart-container {
        margin: 20px auto;
        padding: 0 10px;
      }
      
      .chart-title {
        font-size: 2rem;
        margin-bottom: 30px;
      }
      
      .chart-wrapper {
        height: 350px;
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .chart-container {
        margin: 10px;
        padding: 0 5px;
      }
      
      .chart-title {
        font-size: 1.6rem;
        margin-bottom: 20px;
      }
      
      .chart-wrapper {
        height: 300px;
        padding: 15px;
      }
    }
  `]
})
export class ChartWrapperComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private examService = inject(ExamService);

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(102, 126, 234, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          family: 'Heebo',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Heebo',
          size: 13
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#4a5568',
          font: { 
            size: 14,
            family: 'Heebo'
          }
        },
        grid: { 
          display: false 
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#4a5568',
          font: { 
            size: 12,
            family: 'Heebo'
          },
          stepSize: 1
        },
        grid: {
          color: 'rgba(102, 126, 234, 0.1)',
          
          lineWidth: 1
        }
      }
    }
  };

  constructor() {
    if (this.isBrowser) {
      this.loadChartData();
    }
  }

  loadChartData() {
    this.examService.getExamsPerSubject().subscribe(data => {
      this.barChartData = {
        labels: data.map(d => d.subject),
        datasets: [{
          label: 'כמות מבחנים',
          data: data.map(d => d.count),
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)', 
            'rgba(240, 147, 251, 0.8)',
            'rgba(69, 183, 209, 0.8)',
            'rgba(78, 205, 196, 0.8)',
            'rgba(255, 107, 107, 0.8)'
          ],
          hoverBackgroundColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)', 
            'rgba(240, 147, 251, 1)',
            'rgba(69, 183, 209, 1)',
            'rgba(78, 205, 196, 1)',
            'rgba(255, 107, 107, 1)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)', 
            'rgba(240, 147, 251, 1)',
            'rgba(69, 183, 209, 1)',
            'rgba(78, 205, 196, 1)',
            'rgba(255, 107, 107, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    });
  }
}