import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

import {DiffService} from '../../../core/services/diff.service';

@Component({
  selector: 'app-modal-side-by-side',
  templateUrl: './modal-side-by-side.component.html',
  styleUrls: ['./modal-side-by-side.component.css'],
})
export class ModalSideBySideComponent implements OnInit {

  public oldVersionText = [];
  public newVersionText = [];

  constructor(public dialogRef: MatDialogRef<ModalSideBySideComponent>, public diffService: DiffService) {
  }

  public ngOnInit(): void {
    const diff = this.diffService.getDiff();
    const transformedDiff = this.diffService.processDiff(diff);
    this.oldVersionText = transformedDiff.oldVersionText;
    this.newVersionText = transformedDiff.newVersionText;
  }
}
