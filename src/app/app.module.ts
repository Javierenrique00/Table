import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpapiService } from "./services/httpapi.service";
import {HttpModule, Headers} from '@angular/http';
import { AppRoutingModule } from "./app-routing.module";

import { LoginComponent } from './components/login/login.component';
import { TableComponent } from './components/table/table.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    LoginComponent,
    TableComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [HttpapiService],
  bootstrap: [HomeComponent]
})
export class AppModule { }
