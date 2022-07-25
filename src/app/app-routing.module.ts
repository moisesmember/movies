import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListMovieComponent } from './components/list-movie/list-movie.component';
import { MovieManagerComponent } from './components/movie-manager/movie-manager.component';

const routes: Routes = [
  { path: '', component: ListMovieComponent },
  { path: 'movie', component: MovieManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
