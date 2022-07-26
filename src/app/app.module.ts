import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListMovieComponent } from './components/list-movie/list-movie.component';
import { MovieManagerComponent } from './components/movie-manager/movie-manager.component';
import { SystemManagerComponent } from './components/system-manager/system-manager.component';
import { TablesComponent } from './components/movie-manager/tables/tables.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';

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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
