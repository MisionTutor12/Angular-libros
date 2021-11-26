import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibroComponent,NgbdSortableHeader } from './libro/libro.component';
// import {ToastsContainer} from './ngb-toast-global/app-ngb-toast-global.container';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbToastGlobalComponent } from './ngb-toast-global/ngb-toast-global.component';

@NgModule({
  declarations: [
    AppComponent,
    LibroComponent,
    NgbdSortableHeader,
    NgbToastGlobalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
