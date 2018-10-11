export class SelectedText {
  public startPosition: number;
  public endPosition: number;
  public text: string;

  constructor(start: number, end: number, text: string) {
    this.startPosition = start;
    this.endPosition = end;
    this.text = text;
  }
}
