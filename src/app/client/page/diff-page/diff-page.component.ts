import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DiffService } from '../../../core/services/diff.service';
import { ModalSideBySideComponent } from '../modal-side-by-side/modal-side-by-side.component';

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
    const dialogRef = this.dialog.open(ModalSideBySideComponent, {
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

  public createDiffTable(oldText: any[], newText: any[]): void {
    let oldTextPointer = 0;
    let newTextPointer = 0;
    const rowsCount = oldText.length + newText.length;
    for (let i = 0; i < rowsCount; i++) {
      const oldRow = oldText[oldTextPointer];
      const newRow = newText[newTextPointer];
      if (newText.length !== newTextPointer && oldText.length !== oldTextPointer) {
        if (oldRow.text === newRow.text) {
          this.table.push({oldRowNumber: oldRow.rowNumber, newRowNumber: newRow.rowNumber, text: oldRow.text, id: oldRow.id});
          oldTextPointer++;
          newTextPointer++;
          continue;
        }
        if (oldRow.id < newRow.id) {
          this.table.push({oldRowNumber: oldRow.rowNumber, text: oldRow.text, id: oldRow.id});
          oldTextPointer++;
        } else {
          this.table.push({newRowNumber: newRow.rowNumber, text: newRow.text, id: newRow.id});
          newTextPointer++;
        }
      } else {
        if (oldTextPointer === oldText.length && newTextPointer !== newText.length) {
          this.table.push({newRowNumber: newRow.rowNumber, text: newRow.text, id: newRow.id});
          newTextPointer++;
          continue;
        }
        if (oldTextPointer !== oldText.length && newTextPointer === newText.length) {
          this.table.push({oldRowNumber: oldRow.rowNumber, text: oldRow.text, id: oldRow.id});
          oldTextPointer++;
        }
      }
    }
  }
}
