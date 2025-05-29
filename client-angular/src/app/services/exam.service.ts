// src/app/services/exam.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:5279/api/Exam/stats'; // כתובת מתאימה ל-API שלך

  constructor(private http: HttpClient) {}

  getExamsPerSubject(): Observable<{ subject: string; count: number }[]> {
    return this.http.get<{ subject: string; count: number }[]>(`${this.apiUrl}/exams-per-subject`);
  }
}
