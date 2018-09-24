import {Action} from './action.enum';

/**
 * The model of the part of input line with action.
 */
export class InputRow {
  /**
   * Action for current part of line.
   */
  public action: Action;
  /**
   * The part of line.
   */
  public text: string;

  constructor(action: Action, text: string) {
    this.action = action;
    this.text = text;
  }
}
