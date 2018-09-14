import {Injectable} from '@angular/core';
import {diff_match_patch} from 'diff-match-patch';

import {Row} from '../models/row';
import {RowType} from '../models/row-type.enum';

@Injectable({
  providedIn: 'root',
})
export class DiffService {
  private dmp;
  private diff;
  public oldVersionText = [];
  public newVersionText = [];
  public oldRowIds = [];
  public newRowIds = [];
  public rowIdCounter = 1;

  constructor() {
    this.dmp = new diff_match_patch();
  }

  public setDiff(lastText: string, newText: string): void {
    this.diff = this.dmp.diff_main(lastText, newText);
  }

  public getDiff(): [[number, string]] {
    return this.diff;
  }

  private addRowToTable(row: Row, rowType: RowType): number {
    if (rowType === RowType.oldRow) {
      this.oldVersionText.push(row);
      this.oldRowIds.push(row.id);
    } else {
      this.newVersionText.push(row);
      this.newRowIds.push(row.id);
    }
    this.rowIdCounter++;
    const nextRowNumber = row.rowNumber + 1;

    return nextRowNumber;
  }

  private processMultilineText(currentLines: string[], rowsToNextDisplay: string[], rowType: RowType, rowNumber: number):
    [number, string[]] {
    let partOfNextLine = currentLines.slice(0, 1)[0];
    if (currentLines.length !== 1) {
      const partOfPrevLine = currentLines.shift();
      rowsToNextDisplay.push(partOfPrevLine);
      const rowText = rowsToNextDisplay.join('');
      rowNumber = this.addRowToTable(new Row(this.rowIdCounter, rowText, rowNumber), rowType);
      rowsToNextDisplay = [];

      partOfNextLine = currentLines.pop();
      currentLines.forEach(line => rowNumber = this.addRowToTable(new Row(this.rowIdCounter, line, rowNumber), rowType));
    }
    rowsToNextDisplay.push(partOfNextLine);

    return [rowNumber, rowsToNextDisplay];
  }

  private transformPrevRowArraysToTable(oldRows: string[], newRows: string[], currentOldRow: number, currentNewRow: number):
    [number, number, string[], string[]] {
    const oldLine = oldRows.join('');
    const newLine = newRows.join('');
    if (oldLine !== newLine) {
      this.oldVersionText.push(new Row(this.rowIdCounter, oldLine, currentOldRow));
      this.oldRowIds.push(this.rowIdCounter);
      this.rowIdCounter++;
      this.newRowIds.push(this.rowIdCounter);
      this.newVersionText.push(new Row(this.rowIdCounter, newLine, currentNewRow));
    } else {
      this.oldVersionText.push(new Row(this.rowIdCounter, oldLine, currentOldRow));
      this.rowIdCounter++;
      this.newVersionText.push(new Row(this.rowIdCounter, newLine, currentNewRow));
    }
    this.rowIdCounter++;
    oldRows = [];
    newRows = [];
    currentOldRow += 1;
    currentNewRow += 1;

    return [currentOldRow, currentNewRow, oldRows, newRows];
  }

  private clearData(): void {
    this.oldRowIds = [];
    this.newRowIds = [];
    this.newVersionText = [];
    this.oldVersionText = [];
    this.rowIdCounter = 1;
  }

  public processDiff(diff: [number, string][]): { oldVersionText: Row[], newVersionText: Row[]} {
    this.clearData();
    let oldRows = [];
    let newRows = [];
    let currentOldRow = 1;
    let currentNewRow = 1;
    diff.forEach(currentValue => {
      const [action, text] = currentValue;
      const currentLines = text.split('\n');
      switch (action) {
        case -1:
          [currentOldRow, oldRows] = this.processMultilineText(currentLines, oldRows, RowType.oldRow, currentOldRow);
          break;
        case 1:
          [currentNewRow, newRows] = this.processMultilineText(currentLines, newRows, RowType.newRow, currentNewRow);
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
              this.oldVersionText.push(new Row(this.rowIdCounter, line, currentOldRow));
              this.newVersionText.push(new Row(this.rowIdCounter, line, currentNewRow));
              currentOldRow += 1;
              currentNewRow += 1;
              this.rowIdCounter++;
            });
          }
          oldRows.push(partOfNextLine);
          newRows.push(partOfNextLine);
          break;
      }
    });
    [currentOldRow, currentNewRow, oldRows, newRows] = this.transformPrevRowArraysToTable(oldRows, newRows, currentOldRow, currentNewRow);

    return { oldVersionText: this.oldVersionText, newVersionText: this.newVersionText };
  }

  public isOldRow(rowId: number): boolean {
    return this.oldRowIds.includes(rowId);
  }

  public isNewRow(rowId: number): boolean {
    return this.newRowIds.includes(rowId);
  }
}
