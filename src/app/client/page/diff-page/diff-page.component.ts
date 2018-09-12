import { Component, OnInit } from '@angular/core';

import {DiffService} from '../../../core/services/diff.service';

@Component({
  selector: 'app-diff-page',
  templateUrl: './diff-page.component.html',
  styleUrls: ['./diff-page.component.css'],
})
export class DiffPageComponent implements OnInit {
  public table = [];

  constructor(private diffService: DiffService) {
  }

  public ngOnInit(): void {
    this.processDiff();
  }

  private processMultilineText(currentLines: string[], rowsToNextDisplay: string[], rowNumberName: string, rowNumber: number): any[] {
    let partOfNextLine = currentLines.slice(0, 1)[0];
    if (currentLines.length !== 1) {
      const partOfPrevLine = currentLines.shift();
      rowsToNextDisplay.push(partOfPrevLine);
      const row = {text: rowsToNextDisplay.join('')};
      row[rowNumberName] = rowNumber;
      this.table.push(row);
      rowsToNextDisplay = [];
      rowNumber++;

      partOfNextLine = currentLines.pop();
      currentLines.forEach(line => {
        this.table.push({oldRowNumber: rowNumber, text: line});
        rowNumber++;
      });
    }
    rowsToNextDisplay.push(partOfNextLine);

    return [rowNumber, rowsToNextDisplay];
  }

  private transformPrevRowArraysToTable(oldRows: string[], newRows: string[], currentOldRow: number, currentNewRow: number): any[] {
    const oldLine = oldRows.join('');
    const newLine = newRows.join('');
    if (oldLine !== newLine) {
      this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: oldLine});
    }
    this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: newLine});
    oldRows = [];
    newRows = [];
    currentOldRow += 1;
    currentNewRow += 1;

    return [currentOldRow, currentNewRow, oldRows, newRows];
  }

  private processDiff(): void {
    let oldRows = [];
    let newRows = [];
    let currentOldRow = 1;
    let currentNewRow = 1;
    const diff = this.diffService.getDiff();
    diff.forEach(currentValue => {
      const [action, text] = currentValue;
      const currentLines = text.split('\n');
      switch (action) {
        case -1:
          [currentOldRow, oldRows] = this.processMultilineText(currentLines, oldRows, 'oldRowNumber', currentOldRow);
          break;
        case 1:
          [currentNewRow, newRows] = this.processMultilineText(currentLines, newRows, 'newRowNumber', currentNewRow);
          break;
        case 0:
          let partOfNextLine = currentLines.slice(0, 1)[0];
          if (currentLines.length !== 1) {
            const previousLinePart = currentLines.shift();
            oldRows.push(previousLinePart);
            newRows.push(previousLinePart);
            [currentOldRow, currentNewRow, oldRows, newRows] =
              this.transformPrevRowArraysToTable(oldRows, newRows, currentOldRow, currentNewRow);

            partOfNextLine = currentLines.pop();
            currentLines.forEach(line => {
              this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: line});
              currentOldRow += 1;
              currentNewRow += 1;
            });
          }
          oldRows.push(partOfNextLine);
          newRows.push(partOfNextLine);
          break;
      }
    });
    this.transformPrevRowArraysToTable(oldRows, newRows, currentOldRow, currentNewRow);
  }
}
