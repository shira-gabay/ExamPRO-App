// src/app/services/study-material.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyMaterial } from '../models/study-material.model';
import{environment} from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class StudyMaterialService {
  private apiUrl = `${environment.apiUrl}/api/StudyMaterial`;

  constructor(private http: HttpClient) {}

  getAllMaterials(): Observable<StudyMaterial[]> {
    return this.http.get<StudyMaterial[]>(this.apiUrl);
  }
}
