import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageComponent } from './page/page.component';
import { FileLoaderComponent } from './page/file-loader/file-loader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [PageComponent, FileLoaderComponent],
  exports: [PageComponent],
})
export class ClientModule { }
