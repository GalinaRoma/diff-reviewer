export class Comment {
  public creator: string;
  public text: string;
  public creationDate: Date;
  public rowId: number;

  constructor(creator: string, text: string, creationDate: Date, rowId: number) {
    this.creator = creator;
    this.text = text;
    this.creationDate = creationDate;
    this.rowId = rowId;
  }
}
