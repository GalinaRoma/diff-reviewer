/**
 * The model of the row to the general diff table.
 */
export class CommonRow {
  /**
   * The row number from the old text version (can be null when line does not exist in old version, but exists in new one).
   */
  public oldRowNumber: number;
  /**
   * The row number from the new text version (can be null when line does not exist in new version, but exists in old one).
   */
  public newRowNumber: number;
  /**
   * Text of the line.
   */
  public text: string;
  /**
   * Id number of line to order rows from both versions.
   */
  public id: number;

  public comment: Comment;

  constructor(id: number, text: string, oldRowNumber: number, newRowNumber: number) {
    this.oldRowNumber = oldRowNumber;
    this.newRowNumber = newRowNumber;
    this.text = text;
    this.id = id;
  }
}
