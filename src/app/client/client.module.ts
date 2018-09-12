import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatTableDataSource, MatTableModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import { DiffPageComponent } from './page/diff-page/diff-page.component';
import { FileLoaderComponent } from './page/file-loader/file-loader.component';
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
  declarations: [PageComponent, FileLoaderComponent, DiffPageComponent],
  exports: [PageComponent],
})
export class ClientModule { }
