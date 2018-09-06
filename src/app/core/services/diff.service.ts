import { Injectable } from '@angular/core';
import {diff_match_patch} from 'diff-match-patch';

@Injectable({
  providedIn: 'root',
})
export class DiffService {
  private dmp;
  public diff;
  constructor() {
    this.dmp = new diff_match_patch();
  }

  public getTextDiff(lastText: string, newText: string): void {
    this.diff = this.dmp.diff_main(lastText, newText);
    console.log(this.diff);
  }
}
