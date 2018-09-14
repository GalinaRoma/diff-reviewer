import { Injectable } from '@angular/core';
import {diff_match_patch} from 'diff-match-patch';

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

  private addRowToTable(text: string, rowNumberName: string, rowNumber: number): number {
    const row = {text: text, rowNumber: rowNumber, id: this.rowIdCounter};
    if (rowNumberName === 'oldRowNumber') {
      this.oldVersionText.push(row);
      this.oldRowIds.push(this.rowIdCounter);
    } else {
      this.newVersionText.push(row);
      this.newRowIds.push(this.rowIdCounter);
    }
    this.rowIdCounter++;
    rowNumber++;

    return rowNumber;
  }

  private processMultilineText(currentLines: string[], rowsToNextDisplay: string[], rowNumberName: string, rowNumber: number): any[] {
    let partOfNextLine = currentLines.slice(0, 1)[0];
    if (currentLines.length !== 1) {
      const partOfPrevLine = currentLines.shift();
      rowsToNextDisplay.push(partOfPrevLine);
      const rowText = rowsToNextDisplay.join('');
      rowNumber = this.addRowToTable(rowText, rowNumberName, rowNumber);
      rowsToNextDisplay = [];

      partOfNextLine = currentLines.pop();
      currentLines.forEach(line => rowNumber = this.addRowToTable(line, rowNumberName, rowNumber));
    }
    rowsToNextDisplay.push(partOfNextLine);

    return [rowNumber, rowsToNextDisplay];
  }

  private transformPrevRowArraysToTable(oldRows: string[], newRows: string[], currentOldRow: number, currentNewRow: number): any[] {
    const oldLine = oldRows.join('');
    const newLine = newRows.join('');
    if (oldLine !== newLine) {
      this.oldVersionText.push({rowNumber: currentOldRow, text: oldLine, id: this.rowIdCounter});
      this.oldRowIds.push(this.rowIdCounter);
      this.rowIdCounter++;
      this.newRowIds.push(this.rowIdCounter);
      this.newVersionText.push({rowNumber: currentNewRow, text: newLine, id: this.rowIdCounter});
    } else {
      this.oldVersionText.push({rowNumber: currentOldRow, text: newLine, id: this.rowIdCounter});
      this.newVersionText.push({rowNumber: currentNewRow, text: newLine, id: this.rowIdCounter});
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
  public processDiff(diff: any[]): { oldVersionText: any[], newVersionText: any[]} {
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
              this.oldVersionText.push({rowNumber: currentOldRow, text: line, id: this.rowIdCounter});
              this.newVersionText.push({rowNumber: currentNewRow, text: line, id: this.rowIdCounter});
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
    this.transformPrevRowArraysToTable(oldRows, newRows, currentOldRow, currentNewRow);

    return { oldVersionText: this.oldVersionText, newVersionText: this.newVersionText };
  }

  public isOldRow(rowId: number): boolean {
    return this.oldRowIds.includes(rowId);
  }

  public isNewRow(rowId: number): boolean {
    return this.newRowIds.includes(rowId);
  }
}
