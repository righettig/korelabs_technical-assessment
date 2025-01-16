import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { provideHttpClient } from '@angular/common/http';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
