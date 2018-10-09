import { TestBed, inject } from '@angular/core/testing';

import { CommentMockService } from './comment-mock.service';

describe('CommentMockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentMockService],
    });
  });

  it('should be created', inject([CommentMockService], (service: CommentMockService) => {
    expect(service).toBeTruthy();
  }));
});
