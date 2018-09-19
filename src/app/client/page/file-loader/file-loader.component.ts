import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {DiffService} from '../../../core/services/diff.service';
import {InputService} from '../../../core/services/input.service';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css'],
})
export class FileLoaderComponent implements OnInit {
  constructor(private diffService: DiffService, public inputService: InputService, private router: Router) {}

  public ngOnInit(): void {}

  public loadFiles(event: Event, form: NgForm): void {
    event.preventDefault();
    const oldText = form.controls['old-version'].value;
    const newText = form.controls['new-version'].value;
    this.inputService.inputOldText = oldText;
    this.inputService.inputNewText = newText;

    this.diffService.setDiff(oldText, newText);
    this.router.navigateByUrl('diff');
  }
}
