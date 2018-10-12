import {Comment} from './comment';
import {SelectedText} from './selected-text';

/**
 * The general selection element: text and position of the selection with created comment.
 */
export class SelectionElement {
  /**
   * Comment.
   */
  public comment: Comment;
  /**
   * Selected element: text and selection position.
   */
  public selectedElem: SelectedText;

  constructor(comment: Comment, selectionElem: SelectedText) {
    this.comment = comment;
    this.selectedElem = selectionElem;
  }
}
