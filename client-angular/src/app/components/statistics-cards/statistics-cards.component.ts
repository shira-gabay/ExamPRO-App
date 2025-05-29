import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { SubjectCategoryService } from '../../services/subject-category.service';
import { StudyMaterialService } from '../../services/study-material.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-statistics-cards',
  templateUrl: './statistics-cards.component.html',
  styleUrls: ['./statistics-cards.component.css']
})
export class StatisticsCardsComponent implements OnInit {
  examCount: number = 0;
  subjectCount: number = 0;
  materialCount: number = 0;
  userCount: number = 0;

  constructor(
    private examService: ExamService,
    private subjectCategoryService: SubjectCategoryService,
    private studyMaterialService: StudyMaterialService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.examService.getExamsPerSubject().subscribe(exams => {
      this.examCount = exams.length;
    });

    this.subjectCategoryService.getAllCategories().subscribe(subjects => {
      this.subjectCount = subjects.length;
    });

    this.studyMaterialService.getAllMaterials().subscribe(materials => {
      this.materialCount = materials.length;
    });

    this.userService.getAllUsers().subscribe(users => {
      this.userCount = users.length;
    });
  }
}
