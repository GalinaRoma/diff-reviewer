import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Comment } from '../../../core/models/comment';
import { CommonRow } from '../../../core/models/common-row';
import { Row } from '../../../core/models/row';
import { SelectedText } from '../../../core/models/selected-text';
import { SelectionElement } from '../../../core/models/selection-element';
import { CommentMockService } from '../../../core/services/comment-mock.service';
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
  /**
   * Each array element is the table row with visible(true) or hidden(false) form for a new comment.
   */
  public visibleCommentCreation: Boolean[] = [];
  /**
   * Array for the saving selected text and position after selection event to save it in loadComment event.
   */
  public selectedText: SelectedText[] = [];

  constructor(public diffService: DiffService, public dialog: MatDialog, public commentService: CommentMockService) {}

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
   * Get diff, load table for page and initialize empty comments.
   */
  public ngOnInit(): void {
    this.table = [];
    const { oldVersionText, newVersionText } = this.diffService.processDiff();
    this.table = this.createDiffTable(oldVersionText, newVersionText);
    for (let i = 0; i < this.table.length; i++) {
      if (!this.commentService.comments[i]) {
        this.commentService.comments[i] = [];
      }
    }
    this.commentService.transformComments();
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
        if (oldRow.id === null) {
          oldTextPointer++;
          continue;
        }
        if (newRow.id === null) {
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

  /**
   * Event handler for the select text in the table rows.
   * Save the selected text and it position.
   */
  @HostListener('document:selectionchange') public createMessage(): void {
    const selection = document.getSelection();
    const selectedText = selection.toString();
    const selectedElem = new SelectedText(selection.baseOffset, selection.extentOffset, selectedText);
    if (selectedText !== '' && selectedText !== '\n') {
      const id = Number(selection.baseNode.parentElement.id);
      this.selectedText[id] = selectedElem;
      this.visibleCommentCreation[id] = true;
    }
  }

  /**
   * Close comment.
   *
   * @param {Event} event Click event at the new comment form.
   * @param {number} rowId The row id.
   */
  public closeComment(event: Event, rowId: number): void {
    this.visibleCommentCreation[rowId] = false;
  }

  /**
   * Load the new comment form.
   *
   * @param {Event} event The submit event of the new comment form.
   * @param {NgForm} form
   * @param {number} rowId
   */
  public loadComment(event: Event, form: NgForm, rowId: number): void {
    event.preventDefault();
    const message = form.controls['text'].value;
    this.commentService.comments[rowId].push(new SelectionElement(
      new Comment('Admin', message, new Date(), rowId), this.selectedText[rowId]));
    this.visibleCommentCreation[rowId] = false;
    this.commentService.transformComments();
  }
}
