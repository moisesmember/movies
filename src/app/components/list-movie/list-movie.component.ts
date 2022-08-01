import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { Collaborator } from 'src/app/model/collaborator';
import { Movie } from 'src/app/model/movie';
import { MovieService } from '../../shared/movie.service';

@Component({
  selector: 'app-list-movie',
  templateUrl: './list-movie.component.html',
  styleUrls: ['./list-movie.component.css']
})
export class ListMovieComponent implements OnInit {

  movies!: Movie[];
  myMovies!: Movie[];
  collaborator?: Collaborator;
  constructor(
    public restApi: MovieService,
    private router: Router,
  ) { 
    if( typeof sessionStorage.getItem('session') !=  null){      
      this.collaborator = JSON.parse( sessionStorage.getItem('session') as any ) as Collaborator;
      //console.log( JSON.parse( sessionStorage.getItem('session') as any ).name );
      //console.log( this.collaborator!.username );     
    }
  }

  ngOnInit(): void {
    this.listMovie()
  }

  listMovie(){
    console.log( this.collaborator!.id )
    this.restApi.listMovie().subscribe(data => {
      this.movies = data
      this.myMovies = data.filter( x => x.id_user == this.collaborator!.id )
      console.log( this.myMovies )
    },
    (error) => console.log(`Error`),
     () => console.log( `Complete` ) );
  }

  public info( id: number, isProprietary: Boolean ){    
    localStorage.setItem('id', `${id}`)
    localStorage.setItem('proprietary', `${isProprietary}`)
    let waitingNav = debounce(() => {
      this.router.navigate(['info']);
    }, 1000);
    waitingNav();
  }

}
