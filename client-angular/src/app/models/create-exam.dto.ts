export interface CreateExamDto {
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  examFileUrls: string[];
  studyMaterialUrls: string[];
}
