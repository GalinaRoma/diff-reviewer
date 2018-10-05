import { Injectable } from '@angular/core';

/**
 * Service for save input texts.
 */
@Injectable({
  providedIn: 'root',
})
export class InputService {
  /**
   * The input old text.
   */
  public inputOldText: String = '';
  /**
   * The input new text.
   */
  public inputNewText: String = '';

  constructor() { }
}
