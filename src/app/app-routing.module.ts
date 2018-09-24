import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiffPageComponent } from './client/page/diff-page/diff-page.component';
import { TextLoaderComponent } from './client/page/text-loader/text-loader.component';

const routes: Routes = [
  { path: 'load', component: TextLoaderComponent },
  { path: 'diff', component: DiffPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'load' },
];

/**
 * Routing module.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }
