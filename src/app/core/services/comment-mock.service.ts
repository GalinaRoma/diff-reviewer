import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentMockService {

  public comments: object[] = [];
  public transformedComments;
  constructor() {
  }
  public transformComments(): void {
    this.transformedComments = this.comments.map(row => Object.entries(row).map(r => r[1]));
  }
}
