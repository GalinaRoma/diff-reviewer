export class CommonRow {
  public oldRowNumber: number;
  public newRowNumber: number;
  public text: string;
  public id: number;

  constructor(id: number, text: string, oldRowNumber: number, newRowNumber: number) {
    this.oldRowNumber = oldRowNumber;
    this.newRowNumber = newRowNumber;
    this.text = text;
    this.id = id;
  }
}
