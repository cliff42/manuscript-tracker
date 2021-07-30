import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from './map/map.component';
import { AboutComponent } from './about/about.component';
import { StemmaComponent } from './stemma/stemma.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    AboutComponent,
    StemmaComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    NgxGraphModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
