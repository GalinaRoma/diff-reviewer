import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import { DiffPageComponent } from './page/diff-page/diff-page.component';
import { FileLoaderComponent } from './page/file-loader/file-loader.component';
import { ModalSideBySideComponent } from './page/modal-side-by-side/modal-side-by-side.component';
import { PageComponent } from './page/page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  declarations: [PageComponent, FileLoaderComponent, DiffPageComponent, ModalSideBySideComponent],
  exports: [PageComponent],
})
export class ClientModule { }
