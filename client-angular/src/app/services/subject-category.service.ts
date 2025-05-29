// src/app/services/subject-category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectCategory } from '../models/subject-category.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectCategoryService {
  private apiUrl = 'http://localhost:5279/api/SubjectCategory';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<SubjectCategory[]> {
    return this.http.get<SubjectCategory[]>(this.apiUrl);
  }
}
