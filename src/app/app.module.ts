import { NgModule } from '@angular/core';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientModule } from './client/client.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import {ModalSideBySideComponent} from './client/page/modal-side-by-side/modal-side-by-side.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    CoreModule,
    ClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  entryComponents: [
    ModalSideBySideComponent,
  ],
  providers: [{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent],
})
export class AppModule { }
