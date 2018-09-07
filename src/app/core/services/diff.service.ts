import { Injectable } from '@angular/core';
import {diff_match_patch} from 'diff-match-patch';

@Injectable({
  providedIn: 'root',
})
export class DiffService {
  private dmp;
  private diff;
  constructor() {
    this.dmp = new diff_match_patch();
  }

  public setDiff(lastText: string, newText: string): void {
    this.diff = this.dmp.diff_main(lastText, newText);
  }

  public getDiff(): [[number, string]] {
    return this.diff;
  }
}
