import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-modal-side-by-side',
  templateUrl: './modal-side-by-side.component.html',
  styleUrls: ['./modal-side-by-side.component.css'],
})
export class ModalSideBySideComponent implements OnInit {

  public oldVersion = [];
  public newVersion = [];
  public oldTexts = [];
  public newTexts = [];
  public rowIdCounter = 1;

  constructor(public dialogRef: MatDialogRef<ModalSideBySideComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {diff:  any[]}) {}

  public ngOnInit(): void {
    this.processDiff();
  }
  private addRowToTable(text: string, rowNumberName: string, rowNumber: number): number {
    const row = {text: text, rowNumber: rowNumber, id: this.rowIdCounter};
    if (rowNumberName === 'oldRowNumber') {
      this.oldVersion.push(row);
      this.oldTexts.push(this.rowIdCounter);
    } else {
      this.newVersion.push(row);
      this.newTexts.push(this.rowIdCounter);
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
      this.oldVersion.push({rowNumber: currentOldRow, text: oldLine, id: this.rowIdCounter});
      this.oldTexts.push(this.rowIdCounter);
      this.rowIdCounter++;
      this.newTexts.push(this.rowIdCounter);
      this.newVersion.push({rowNumber: currentNewRow, text: newLine, id: this.rowIdCounter});
    } else {
      this.oldVersion.push({rowNumber: currentOldRow, text: newLine, id: this.rowIdCounter});
      this.newVersion.push({rowNumber: currentNewRow, text: newLine, id: this.rowIdCounter});
    }
    this.rowIdCounter++;
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
    this.data.diff.forEach(currentValue => {
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
              this.oldVersion.push({rowNumber: currentOldRow, text: line, id: this.rowIdCounter});
              this.newVersion.push({rowNumber: currentNewRow, text: line, id: this.rowIdCounter});
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
  }

  public isOldRow(rowId: number): boolean {
    return this.oldTexts.includes(rowId);
  }

  public isNewRow(rowId: number): boolean {
    return this.newTexts.includes(rowId);
  }
}
