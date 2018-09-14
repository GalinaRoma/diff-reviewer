import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Row } from '../../../core/models/row';
import { DiffService } from '../../../core/services/diff.service';
import { ModalSideBySideComponent } from '../modal-side-by-side/modal-side-by-side.component';
import {CommonRow} from '../../../core/models/common-row';

@Component({
  selector: 'app-diff-page',
  templateUrl: './diff-page.component.html',
  styleUrls: ['./diff-page.component.css'],
})
export class DiffPageComponent implements OnInit {
  public table = [];

  constructor(public diffService: DiffService, public dialog: MatDialog) {
  }

  public openModal(): void {
    this.dialog.open(ModalSideBySideComponent, {
      width: '98%',
      height: '96%',
    });
  }

  public ngOnInit(): void {
    const diff = this.diffService.getDiff();
    const transformedDiff = this.diffService.processDiff(diff);
    const oldVersionText = transformedDiff.oldVersionText;
    const newVersionText = transformedDiff.newVersionText;
    this.createDiffTable(oldVersionText, newVersionText);
  }

  public createDiffTable(oldText: Row[], newText: Row[]): void {
    let oldTextPointer = 0;
    let newTextPointer = 0;
    const rowsCount = oldText.length + newText.length;
    for (let i = 0; i < rowsCount; i++) {
      const oldRow = oldText[oldTextPointer];
      const newRow = newText[newTextPointer];
      if (newText.length !== newTextPointer && oldText.length !== oldTextPointer) {
        if (oldRow.text === newRow.text) {
          this.table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, newRow.rowNumber));
          oldTextPointer++;
          newTextPointer++;
          continue;
        }
        if (oldRow.id < newRow.id) {
          this.table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, null));
          oldTextPointer++;
        } else {
          this.table.push(new CommonRow(newRow.id, newRow.text, null, newRow.rowNumber));
          newTextPointer++;
        }
      } else {
        if (oldTextPointer === oldText.length && newTextPointer !== newText.length) {
          this.table.push(new CommonRow(newRow.id, newRow.text, null, newRow.rowNumber));
          newTextPointer++;
          continue;
        }
        if (oldTextPointer !== oldText.length && newTextPointer === newText.length) {
          this.table.push(new CommonRow(oldRow.id, oldRow.text, oldRow.rowNumber, null));
          oldTextPointer++;
        }
      }
    }
  }
}
