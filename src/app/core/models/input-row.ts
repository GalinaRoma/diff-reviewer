import {Action} from './action.enum';

export class InputRow {
  public action: Action;
  public text: string;

  constructor(action: Action, text: string) {
    this.action = action;
    this.text = text;
  }
}
