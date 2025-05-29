export interface Exam {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  subjectId: string;
  examFileUrls: string[];
  studyMaterialUrls: string[];
  createdAt: Date;
}
