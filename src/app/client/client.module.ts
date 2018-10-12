import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DiffPageComponent } from './page/diff-page/diff-page.component';
import { ModalSideBySideComponent } from './page/modal-side-by-side/modal-side-by-side.component';
import { PageComponent } from './page/page.component';
import { TextLoaderComponent } from './page/text-loader/text-loader.component';

/**
 * The client module.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ],
  declarations: [PageComponent, TextLoaderComponent, DiffPageComponent, ModalSideBySideComponent],
  exports: [PageComponent],
})
export class ClientModule { }
