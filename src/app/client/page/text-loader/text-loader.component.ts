import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { InputService } from '../../../core/services/input.service';

/**
 * The component for load old and new text versions.
 */
@Component({
  selector: 'app-file-loader',
  templateUrl: './text-loader.component.html',
  styleUrls: ['./text-loader.component.css'],
})
export class TextLoaderComponent implements OnInit {
  constructor(public inputService: InputService, private router: Router) {}

  /**
   * Init function.
   */
  public ngOnInit(): void {}

  /**
   * The event click handler for save text versions and go to diff page.
   *
   * @param {Event} event The click event.
   * @param {NgForm} form Form with textareas as controls.
   */
  public loadFiles(event: Event, form: NgForm): void {
    event.preventDefault();
    this.inputService.inputOldText = form.controls['old-version'].value;
    this.inputService.inputNewText = form.controls['new-version'].value;
    this.router.navigateByUrl('diff');
  }
}
