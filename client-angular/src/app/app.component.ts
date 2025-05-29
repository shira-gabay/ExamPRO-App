import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { StatisticsCardsComponent } from './components/statistics-cards/statistics-cards.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StatisticsCardsComponent, ChartWrapperComponent],
  template: `
    <div class="app-container">
      <!-- Header Section -->
      <header class="hero-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="main-title">
              <span class="title-gradient">מרכז הבקרה</span>
            </h1>
            <h2 class="subtitle">סטטיסטיקות ודוחות מתקדמים</h2>
            <p class="description">ניתוח נתונים בזמן אמת עם ויזואליזציה מתקדמת</p>
          </div>
          <div class="decorative-element">
            <div class="floating-icon">📊</div>
            <div class="floating-icon delayed">📈</div>
            <div class="floating-icon delayed-2">💹</div>
          </div>
        </div>
        <div class="wave-divider">
          <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7L1200,64L1200,120L1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"></path>
          </svg>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Statistics Section -->
        <section class="stats-section">
          <div class="section-header">
            <h3 class="section-title">נתונים חיוניים</h3>
            <div class="section-indicator"></div>
          </div>
          <app-statistics-cards></app-statistics-cards>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
          <div class="section-header">
            <h3 class="section-title">ניתוח גרפי</h3>
            <div class="section-indicator"></div>
          </div>
          <div class="chart-container">
            <app-chart-wrapper></app-chart-wrapper>
          </div>
        </section>
      </main>

      <!-- Background Elements -->
      <div class="bg-decoration">
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}