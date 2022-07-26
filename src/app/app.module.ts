import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListMovieComponent } from './components/list-movie/list-movie.component';
import { MovieManagerComponent } from './components/movie-manager/movie-manager.component';
import { SystemManagerComponent } from './components/system-manager/system-manager.component';
import { TablesComponent } from './components/movie-manager/tables/tables.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ListMovieComponent,
    MovieManagerComponent,
    SystemManagerComponent,
    TablesComponent,
    MovieInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule
  ],
  providers: [{provide:LOCALE_ID, useValue:'pt-BR'}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
