/**
 * The comment model.
 */
export class Comment {
  /**
   * The creator of the comment.
   */
  public creator: string;
  /**
   * The text of the comment.
   */
  public text: string;
  /**
   * The creation date of the comment.
   */
  public creationDate: Date;
  /**
   * The row id where the comment created.
   */
  public rowId: number;

  constructor(creator: string, text: string, creationDate: Date, rowId: number) {
    this.creator = creator;
    this.text = text;
    this.creationDate = creationDate;
    this.rowId = rowId;
  }
}
