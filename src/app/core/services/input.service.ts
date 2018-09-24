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
  public inputOldText: string;
  /**
   * The input new text.
   */
  public inputNewText: string;

  constructor() { }
}
