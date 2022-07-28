import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprouteguardService } from './shared/approuteguard.service';

import { ListMovieComponent } from './components/list-movie/list-movie.component';
import { MovieManagerComponent } from './components/movie-manager/movie-manager.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';

const routes: Routes = [  
  { path: '', component: AuthenticationComponent, pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent }, 
  { path: 'list', component: ListMovieComponent, canActivate: [ApprouteguardService]},
  { path: 'movie', component: MovieManagerComponent, canActivate: [ApprouteguardService] },
  { path: 'info', component: MovieInfoComponent, canActivate: [ApprouteguardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
