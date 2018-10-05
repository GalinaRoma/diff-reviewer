import { Injectable } from '@angular/core';

import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentMockService {

  public comments: object[] = [
    {'23': new Comment('Galina', 'first', new Date(), 1)},
  ];
  public transformedComments;
  constructor() {
  }
  public transformComments(): void {
    this.transformedComments = this.comments.map(row => Object.entries(row).map(r => r[1]));
  }
}
