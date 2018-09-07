import { Component, OnInit } from '@angular/core';

import {DiffService} from '../../../core/services/diff.service';

@Component({
  selector: 'app-diff-page',
  templateUrl: './diff-page.component.html',
  styleUrls: ['./diff-page.component.css'],
})
export class DiffPageComponent implements OnInit {
  public table = [];

  constructor(private diffService: DiffService) {}

  public ngOnInit(): void {
    this.processDiff();
  }

  public processDiff(): void {
    let oldRows = [];
    let newRows = [];
    let oldRow;
    let newRow;
    const diff = this.diffService.getDiff();
    console.log(diff);
    diff.forEach(([action, text]) => {
      switch (action) {
        case -1:
          const oldLines = text.split('\n');
          oldRow = oldLines.join('\n');
          oldRows.push(oldRow);
          break;
        case 1:
          const newLines = text.split('\n');
          newRow = newLines.join('\n');
          newRows.push(newRow);
          break;
        case 0:
          const commonLines = text.split('\n');
          const commonRows = commonLines.join('\n');
          oldRows.push(commonRows);
          newRows.push(commonRows);
          break;
      }
    });
    this.displaySomeText(oldRows);
    this.displaySomeText(newRows);
  }

  public displaySomeText(textArray: string[]): void {
    const textRow = textArray.join('');

    this.table.push({rowNumber: 1,  text: textRow});
  }
}
