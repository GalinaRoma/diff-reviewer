export class Row {
  public id: number;
  public text: string;
  public rowNumber: number;

  constructor(id: number, text: string, rowNumber: number) {
    this.id = id;
    this.text = text;
    this.rowNumber = rowNumber;
  }
}
