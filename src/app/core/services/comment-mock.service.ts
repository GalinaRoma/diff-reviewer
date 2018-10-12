import { Injectable } from '@angular/core';

import { SelectionElement } from '../models/selection-element';

/**
 * The mock service for store the comments.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentMockService {
  /**
   * Comments with it selected elements(text and position).
   */
  public comments: Array<Array<SelectionElement>> = [];
  /**
   * Transformed comments fot load it in html.
   */
  public transformedComments;

  constructor() {
  }

  public transformComments(): void {
    this.transformedComments = this.comments
      .map(rowComments => rowComments
      .map(selectionElement => selectionElement.comment));
  }
}
