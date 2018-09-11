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

  public processDiff(): void {
    let oldRows = [];
    let newRows = [];
    let currentOldRow = 1;
    let currentNewRow = 1;
    const diff = this.diffService.getDiff();
    diff.forEach((currentValue, index) => {
      const [action, text] = currentValue;
      const currentLines = text.split('\n');
      switch (action) {
        case -1:
          if (currentLines.length !== 1) {
            oldRows.push(currentLines.splice(0, 1));
            const oldRow = oldRows.join('');
            this.table.push({oldRowNumber: currentOldRow, text: oldRow});
            oldRows = [];
            currentOldRow += 1;
            if (index !== diff.length - 1) {
              currentLines.splice(currentLines.length - 1, 1);
            }
            currentLines.forEach(line => {
              this.table.push({oldRowNumber: currentOldRow, text: line});
              currentOldRow += 1;
            });
            break;
          }
          oldRows.push(currentLines[0]);
          break;
        case 1:
          if (currentLines.length !== 1) {
            newRows.push(currentLines.splice(0, 1));
            const newRow = newRows.join('');
            this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: newRow});
            newRows = [];
            currentNewRow += 1;
            if (index !== diff.length - 1) {
              currentLines.splice(currentLines.length - 1, 1);
            }
            currentLines.forEach(line => {
              this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: line});
              currentNewRow += 1;
            });
            break;
          }
          newRows.push(currentLines[0]);
          break;
        case 0:
          if (currentLines.length !== 1) {
            const previousLinePart = currentLines.splice(0, 1)[0];
            oldRows.push(previousLinePart);
            newRows.push(previousLinePart);
            const oldRow = oldRows.join('');
            const newRow = newRows.join('');
            if (oldRow !== newRow) {
              this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: oldRow});
            }
            this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: newRow});
            oldRows = [];
            currentOldRow += 1;
            newRows = [];
            currentNewRow += 1;
            if (index !== diff.length - 1) {
              currentLines.splice(currentLines.length - 1, 1);
            }
            currentLines.forEach(line => {
              this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: line});
              currentOldRow += 1;
              currentNewRow += 1;
            });
            break;
          }
          oldRows.push(currentLines[0]);
          newRows.push(currentLines[0]);
          break;
      }
    });
    if (oldRows.length !== 0) {
      const oldRow = oldRows.join('');
      this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: oldRow});
    }
    if (newRows.length !== 0) {
      const newRow = newRows.join('');
      this.table.push({oldRowNumber: currentOldRow, newRowNumber: currentNewRow, text: newRow});
    }
  }
}
