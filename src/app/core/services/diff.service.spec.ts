import { TestBed, inject } from '@angular/core/testing';

import { DiffService } from './diff.service';

describe('DiffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiffService],
    });
  });

  it('should be created', inject([DiffService], (service: DiffService) => {
    expect(service).toBeTruthy();
  }));
});
