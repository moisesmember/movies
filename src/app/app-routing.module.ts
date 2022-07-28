import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListMovieComponent } from './components/list-movie/list-movie.component';
import { MovieManagerComponent } from './components/movie-manager/movie-manager.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';

const routes: Routes = [
  { path: '', component: ListMovieComponent },
  { path: 'login', component: AuthenticationComponent },
  { path: 'movie', component: MovieManagerComponent },
  { path: 'info', component: MovieInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
