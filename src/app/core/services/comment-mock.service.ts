import { Injectable } from '@angular/core';

import { SelectionElement } from '../models/selection-element';

@Injectable({
  providedIn: 'root',
})
export class CommentMockService {

  public comments: Array<Array<SelectionElement>> = [];
  public transformedComments;
  constructor() {
  }
  public transformComments(): void {
    this.transformedComments = this.comments.map(elem => elem.map(commentObj => commentObj.comment));
  }
}
