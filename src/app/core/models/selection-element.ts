import {Comment} from './comment';
import {SelectedText} from './selected-text';

export class SelectionElement {
  public comment: Comment;
  public selectedElem: SelectedText;
  constructor(comment: Comment, selectionElem: SelectedText) {
    this.comment = comment;
    this.selectedElem = selectionElem;
  }
}
