import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiffPageComponent } from './client/page/diff-page/diff-page.component';
import { FileLoaderComponent } from './client/page/file-loader/file-loader.component';

const routes: Routes = [
  { path: 'load', component: FileLoaderComponent },
  { path: 'diff', component: DiffPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'load' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }
