/**
 * The model of the row for separately old and new version arrays.
 */
export class Row {
  /**
   * The id of the row in the general diff table.
   */
  public id: number;
  /**
   * The text of the current line.
   */
  public text: string;
  /**
   * The row number of the certain text version.
   */
  public rowNumber: number;
  /**
   * Line is changed (delete or add to file).
   */
  public changed: boolean;

  constructor(id: number, text: string = '', rowNumber: number, changed: boolean = false) {
    this.id = id;
    this.text = text;
    this.rowNumber = rowNumber;
    this.changed = changed;
  }
}
