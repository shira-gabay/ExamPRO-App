// src/app/services/study-material.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyMaterial } from '../models/study-material.model';

@Injectable({
  providedIn: 'root'
})
export class StudyMaterialService {
  private apiUrl = 'http://localhost:5279/api/StudyMaterial';

  constructor(private http: HttpClient) {}

  getAllMaterials(): Observable<StudyMaterial[]> {
    return this.http.get<StudyMaterial[]>(this.apiUrl);
  }
}
