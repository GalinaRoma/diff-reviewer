export class Row {
  public id: number;
  public text: string;
  public rowNumber: number;
  public changed: boolean;

  constructor(id: number, text: string = '', rowNumber: number, changed: boolean = false) {
    this.id = id;
    this.text = text;
    this.rowNumber = rowNumber;
    this.changed = changed;
  }
}
