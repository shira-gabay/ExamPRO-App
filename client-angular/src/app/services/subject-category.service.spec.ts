import { TestBed } from '@angular/core/testing';

import { SubjectCategoryService } from './subject-category.service';

describe('SubjectCategoryService', () => {
  let service: SubjectCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
