/**
 * The model of the selection(after the select text in the text row to create new comment)
 */
export class SelectedText {
  /**
   * The start position of the selected text.
   */
  public startPosition: number;
  /**
   * the end position of the selected text.
   */
  public endPosition: number;
  /**
   * The selected text.
   */
  public text: string;

  constructor(start: number, end: number, text: string) {
    this.startPosition = start;
    this.endPosition = end;
    this.text = text;
  }
}
