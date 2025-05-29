export interface SubjectCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface SubjectCategoryCreateDto {
  name: string;
}
