import {Component, OnInit} from '@angular/core';

import {DiffService} from '../../../core/services/diff.service';

/**
 * The modal dialog window for side-by-side diff.
 */
@Component({
  selector: 'app-modal-side-by-side',
  templateUrl: './modal-side-by-side.component.html',
  styleUrls: ['./modal-side-by-side.component.css'],
})
export class ModalSideBySideComponent implements OnInit {
  /**
   * The rowset from the old version text with meta(row number, id and state).
   */
  public oldVersionText = [];
  /**
   * The rowset from the new version text with meta(row number, id and state).
   */
  public newVersionText = [];

  constructor(public diffService: DiffService) {}

  /**
   * Load tables with diff from service.
   */
  public ngOnInit(): void {
    const transformedDiff = this.diffService.processDiff();
    this.oldVersionText = transformedDiff.oldVersionText;
    this.newVersionText = transformedDiff.newVersionText;
  }
}
