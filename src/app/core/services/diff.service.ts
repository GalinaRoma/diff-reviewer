import {Injectable} from '@angular/core';
import {diff_match_patch} from 'diff-match-patch';

import {Action} from '../models/action.enum';
import {InputRow} from '../models/input-row';
import {Row} from '../models/row';
import {RowType} from '../models/row-type.enum';

import {InputService} from './input.service';

/**
 * Service to get diff and process it to the two text versions arrays.
 */
@Injectable({
  providedIn: 'root',
})
export class DiffService {
  private readonly dmp;
  /**
   * Old text version with meta(row number, state and id).
   */
  public oldVersionText = [];
  /**
   * New text version with meta(row number, state and id).
   */
  public newVersionText = [];
  /**
   * Rows ids that are deleted from text (to set red background).
   */
  public oldRowIds = [];
  /**
   * Rows ids that are added to text (to set green background).
   */
  public newRowIds = [];
  /**
   * General counter of rows.
   */
  public rowIdCounter = 0;

  constructor(private inputService: InputService) {
    this.dmp = new diff_match_patch();
  }

  /**
   * Clear global data.
   */
  private clearData(): void {
    this.oldRowIds = [];
    this.newRowIds = [];
    this.newVersionText = [];
    this.oldVersionText = [];
    this.rowIdCounter = 0;
  }

  /**
   * Add row to the relevant table seeing the row type.
   *
   * @param {Row} row Row with text, id? row number and changed boolean state.
   * @param {RowType} rowType Row type (old row/new row).
   */
  private addRowToTable(row: Row, rowType: RowType): number {
    console.log(row);
    if (rowType === RowType.oldRow) {
      this.oldVersionText.push(row);
    } else {
      this.newVersionText.push(row);
    }
    this.rowIdCounter++;

    return row.rowNumber + 1;
  }

  /**
   * Process the multiline changed text (deleted or added).
   * If the text has only part of one line (without \n), add it to the cumulative array and continue to get other parts.
   * Else process the first line (after split text on \n), add it to the cumulative array, join it and write result row to the table.
   * Get the last line, add other lines to the table.
   * Add the saved last line to the cumulative array for getting all next parts.
   *
   * @param {string[]} currentLines Element of library diff splited by \n.
   * @param {InputRow[]} rowsToNextDisplay The cumulative array for current line.
   * @param {RowType} rowType Row type.
   * @param {number} rowNumber Row number in the certain text version.
   */
  private processMultilineText(currentLines: string[], rowsToNextDisplay: InputRow[], rowType: RowType, rowNumber: number):
    [number, InputRow[]] {
    let partOfNextLine = currentLines.slice(0, 1)[0];
    const action = rowType === RowType.oldRow ? Action.delete : Action.add;
    if (currentLines.length !== 1) {
      const partOfPrevLine = currentLines.shift();
      rowsToNextDisplay.push(new InputRow(action, partOfPrevLine));
      const rowText = rowsToNextDisplay.map(elem => elem.text).join('');
      rowNumber = this.addRowToTable(new Row(this.rowIdCounter, rowText, rowNumber,
        !(rowsToNextDisplay.slice(0, 1)[0].action === Action.notChanged && partOfPrevLine === '')), rowType);
      rowsToNextDisplay = [];

      partOfNextLine = currentLines.pop();
      currentLines.forEach(line => rowNumber = this.addRowToTable(new Row(this.rowIdCounter, line, rowNumber, true),
        rowType));
    }
    rowsToNextDisplay.push(new InputRow(action, partOfNextLine));

    return [rowNumber, rowsToNextDisplay];
  }

  /**
   * Sdd to the both tables common lines.
   *
   * @param {InputRow[]} oldRows Old version rows.
   * @param {InputRow[]} newRows New version rows.
   * @param {number} currentOldRow Number of the row in the old text version.
   * @param {number} currentNewRow Number of the row in the new text version.
   */
  private transformPrevRowArraysToTable(oldRows: InputRow[], newRows: InputRow[], currentOldRow: number, currentNewRow: number):
    [number, number, InputRow[], InputRow[]] {
    const oldLine = oldRows.map(elem => elem.text).join('');
    const newLine = newRows.map(elem => elem.text).join('');
    const changedOld = oldRows.some(row => (row.action !== Action.notChanged && row.text !== ''));
    const changedNew = newRows.some(row => (row.action !== Action.notChanged && row.text !== ''));
    this.oldVersionText.push(new Row(this.rowIdCounter, oldLine, currentOldRow, changedOld));
    this.rowIdCounter++;
    this.newVersionText.push(new Row(this.rowIdCounter, newLine, currentNewRow, changedNew));
    this.rowIdCounter++;
    oldRows = [];
    newRows = [];
    currentOldRow += 1;
    currentNewRow += 1;

    return [currentOldRow, currentNewRow, oldRows, newRows];
  }

  /**
   * Transform diff tables.
   * Add extra empty lines opposite the deleted or added line.
   *
   * @param {Row[]} oldText Rows of the old text version.
   * @param {Row[]} newText Rows of the new text version.
   */
  private transformDiffTables(oldText: Row[], newText: Row[]): void {
    const modifiedOldVersionText = [];
    const modifiedNewVersionText = [];
    let oldTextPointer = 0;
    let newTextPointer = 0;
    for (let i = 0; i < oldText.length + newText.length; i++) {
      const oldRow = oldText[oldTextPointer];
      const newRow = newText[newTextPointer];
      if (newText.length === newTextPointer && oldText.length === oldTextPointer) {
        break;
      }
      if (newText.length !== newTextPointer && oldText.length !== oldTextPointer && oldRow.text === newRow.text) {
        modifiedOldVersionText.push(oldRow);
        modifiedNewVersionText.push(newRow);
        oldTextPointer++;
        newTextPointer++;
      } else if (newTextPointer === newText.length || (oldTextPointer !== oldText.length && oldRow.id < newRow.id)) {
        modifiedOldVersionText.push(oldRow);
        oldTextPointer++;
        modifiedNewVersionText.push(new Row(null, '', null));
      } else if (oldTextPointer === oldText.length || (newTextPointer !== newText.length && oldRow.id >= newRow.id)) {
        modifiedNewVersionText.push(newRow);
        newTextPointer++;
        modifiedOldVersionText.push(new Row(null, '', null));
      }
    }
    this.oldVersionText = modifiedOldVersionText;
    this.newVersionText = modifiedNewVersionText;
  }

  /**
   * Select rows by id to color in green or red color.
   *
   * @param {Row[]} oldText Rows of the old text version.
   * @param {Row[]} newText Rows of the new text version.
   */
  private selectChangedRows(oldText: Row[], newText: Row[]): void {
    for (let i = 0; i < oldText.length; i++) {
      const oldRow = oldText[i];
      const newRow = newText[i];
      if (oldRow.changed) {
        this.oldRowIds.push(oldRow.id);
      }
      if (newRow.changed) {
        this.newRowIds.push(newRow.id);
      }
    }
  }

  /**
   * Process diff array by action(delete, add, not changed).
   * It action process divide into process the first line, last line and other between its.
   * Transform result arrays with extra empty lines.
   * Add ids to relevant arrays to color itself.
   */
  public processDiff(): { oldVersionText: Row[], newVersionText: Row[]} {
    this.clearData();
    const diff = this.dmp.diff_main(this.inputService.inputOldText, this.inputService.inputNewText);
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
          const currentAction = Action.notChanged;
          if (currentLines.length !== 1) {
            const previousLinePart = currentLines.shift();
            oldRows.push(new InputRow(currentAction, previousLinePart));
            newRows.push(new InputRow(currentAction, previousLinePart));
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
          oldRows.push(new InputRow(currentAction, partOfNextLine));
          newRows.push(new InputRow(currentAction, partOfNextLine));
          break;
      }
    });
    [currentOldRow, currentNewRow, oldRows, newRows] = this.transformPrevRowArraysToTable(oldRows, newRows, currentOldRow, currentNewRow);
    console.log(this.oldVersionText);
    this.transformDiffTables(this.oldVersionText, this.newVersionText);
    this.selectChangedRows(this.oldVersionText, this.newVersionText);

    return { oldVersionText: this.oldVersionText, newVersionText: this.newVersionText };
  }

  /**
   * Check the row should be deleted(have red background).
   *
   * @param rowId Id of the current row.
   */
  public isOldRow(rowId: number): boolean {
    return this.oldRowIds.includes(rowId);
  }

  /**
   * Check the row should be added(have green background).
   *
   * @param rowId Id of the current row.
   */
  public isNewRow(rowId: number): boolean {
    return this.newRowIds.includes(rowId);
  }
}
