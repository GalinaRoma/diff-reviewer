import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputService {

  public inputOldText: string;
  public inputNewText: string;

  constructor() { }
}
