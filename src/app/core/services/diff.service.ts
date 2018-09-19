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
    } else {
      this.newVersionText.push(row);
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
      rowNumber = this.addRowToTable(new Row(this.rowIdCounter, rowText, rowNumber,
        rowsToNextDisplay.length !== 1 || partOfPrevLine !== ''), rowType);
      rowsToNextDisplay = [];

      partOfNextLine = currentLines.pop();
      currentLines.forEach(line => rowNumber = this.addRowToTable(new Row(this.rowIdCounter, line, rowNumber, true), rowType));
    }
    rowsToNextDisplay.push(partOfNextLine);

    return [rowNumber, rowsToNextDisplay];
  }

  private transformPrevRowArraysToTable(oldRows: string[], newRows: string[], currentOldRow: number, currentNewRow: number):
    [number, number, string[], string[]] {
    const oldLine = oldRows.join('');
    const newLine = newRows.join('');
    if (oldLine !== newLine) {
      this.oldVersionText.push(new Row(this.rowIdCounter, oldLine, currentOldRow, true));
      this.rowIdCounter++;
      this.newVersionText.push(new Row(this.rowIdCounter, newLine, currentNewRow, true));
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
    console.log(diff);
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
    const transformedTexts = this.transformDiffTables(this.oldVersionText, this.newVersionText);
    this.oldVersionText = transformedTexts.oldTextVersion;
    this.newVersionText = transformedTexts.newTextVersion;
    this.selectChangedRows(this.oldVersionText, this.newVersionText);

    return { oldVersionText: this.oldVersionText, newVersionText: this.newVersionText };
  }

  public isOldRow(rowId: number): boolean {
    return this.oldRowIds.includes(rowId);
  }

  public isNewRow(rowId: number): boolean {
    return this.newRowIds.includes(rowId);
  }

  public selectChangedRows(oldText: Row[], newText: Row[]): void {
    const rowsCount = oldText.length;
    console.log(oldText);
    console.log(newText);
    for (let i = 0; i < rowsCount; i++) {
      const oldRow = oldText[i];
      const newRow = newText[i];
      if (oldRow.text === newRow.text && !oldRow.changed && !newRow.changed) {
        continue;
      }
      if (oldRow.changed) {
        this.oldRowIds.push(oldRow.id);
      }
      if (newRow.changed) {
        this.newRowIds.push(newRow.id);
      }
    }
  }

  public transformDiffTables(oldText: Row[], newText: Row[]): {oldTextVersion: Row[], newTextVersion: Row[]} {
    let oldTextPointer = 0;
    let newTextPointer = 0;
    const oldVersionText = [];
    const newVersionText = [];
    const rowsCount = oldText.length + newText.length;
    for (let i = 0; i < rowsCount; i++) {
      const oldRow = oldText[oldTextPointer];
      const newRow = newText[newTextPointer];
      if (newText.length !== newTextPointer && oldText.length !== oldTextPointer) {
        if (oldRow.text === newRow.text) {
          oldVersionText.push(oldRow);
          newVersionText.push(newRow);
          oldTextPointer++;
          newTextPointer++;
          continue;
        }
        if (oldRow.id < newRow.id) {
          oldVersionText.push(oldRow);
          oldTextPointer++;
          if (oldRow.changed) {
            newVersionText.push(new Row(null, '', null));
          }
        } else {
          newVersionText.push(newRow);
          newTextPointer++;
          if (newRow.changed) {
            oldVersionText.push(new Row(null, '', null));
          }
        }
      } else {
        if (oldTextPointer === oldText.length && newTextPointer !== newText.length) {
          newVersionText.push(newRow);
          newTextPointer++;
          oldVersionText.push(new Row(null, '', null));
          continue;
        }
        if (oldTextPointer !== oldText.length && newTextPointer === newText.length) {
          oldVersionText.push(oldRow);
          oldTextPointer++;
          newVersionText.push(new Row(null, '', null));
        }
      }
    }
    return {oldTextVersion: oldVersionText, newTextVersion: newVersionText};
  }
}
