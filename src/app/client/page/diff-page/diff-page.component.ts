import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommonRow } from '../../../core/models/common-row';
import { Row } from '../../../core/models/row';
import { DiffService } from '../../../core/services/diff.service';
import { ModalSideBySideComponent } from '../modal-side-by-side/modal-side-by-side.component';

/**
 * Component for the general diff with common view of two texts.
 */
@Component({
  selector: 'app-diff-page',
  templateUrl: './diff-page.component.html',
  styleUrls: ['./diff-page.component.css'],
})
export class DiffPageComponent implements OnInit {
  /**
   * The rowset of lines to display in HTML.
   */
  public table: CommonRow[];

  constructor(public diffService: DiffService, public dialog: MatDialog) {}

  /**
   * The click event handler to open modal window with side-by-side diff.
   */
  public openModal(): void {
    this.dialog.open(ModalSideBySideComponent, {
      width: '98%',
      height: '96%',
    });
  }

  /**
   * Get diff and load table for page.
   */
  public ngOnInit(): void {
    const { oldVersionText, newVersionText } = this.diffService.processDiff();
    this.table = this.createDiffTable(oldVersionText, newVersionText);
  }

  /**
   * Get two arrays with old and new text versions and create general table for diff.
   * Go through each array and compare lines by text and id.
   * Not add lines with no id (these lines are necessary for side-by-side diff).
   * In the case of the any array termination add to the table a remainder of another one.
   *
   * @param {Row[]} oldText Old text version with meta data(row number, id and state).
   * @param {Row[]} newText New text version with meta data(row number, id and state).
   */
  private createDiffTable(oldText: Row[], newText: Row[]): CommonRow[] {
    const table = [];
    let oldTextPointer = 0;
    let newTextPointer = 0;
    for (let i = 0; i < oldText.length + newText.length; i++) {
      const oldRow = oldText[oldTextPointer];
      const newRow = newText[newTextPointer];
      if (newText.length !== newTextPointer && oldText.length !== oldTextPointer) {
        if (!oldRow.id) {
          oldTextPointer++;
          continue;
        }
        if (!newRow.id) {
          newTextPointer++;
          continue;
        }
        if (oldRow.text === newRow.text) {
          table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, newRow.rowNumber));
          oldTextPointer++;
          newTextPointer++;
        } else if (oldRow.id < newRow.id) {
          table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, null));
          oldTextPointer++;
        } else {
          table.push(new CommonRow(newRow.id, newRow.text, null, newRow.rowNumber));
          newTextPointer++;
        }
      } else {
        if (oldTextPointer === oldText.length && newTextPointer !== newText.length) {
          table.push(new CommonRow(newRow.id, newRow.text, null, newRow.rowNumber));
          newTextPointer++;
          continue;
        }
        if (oldTextPointer !== oldText.length && newTextPointer === newText.length) {
          table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, null));
          oldTextPointer++;
        }
      }
    }
    return table;
  }
}
