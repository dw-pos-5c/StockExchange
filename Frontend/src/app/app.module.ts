import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./modules/core/core.module";
import {SharedModule} from "./modules/shared/shared.module";
import {FormsModule} from "@angular/forms";
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        FormsModule,
        NgChartsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
