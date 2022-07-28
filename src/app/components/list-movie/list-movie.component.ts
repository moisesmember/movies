import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { Movie } from 'src/app/model/movie';
import { MovieService } from '../../shared/movie.service';

@Component({
  selector: 'app-list-movie',
  templateUrl: './list-movie.component.html',
  styleUrls: ['./list-movie.component.css']
})
export class ListMovieComponent implements OnInit {

  movies!: Movie[];

  constructor(
    public restApi: MovieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.listMovie()
  }

  listMovie(){
    this.restApi.listMovie().subscribe(data => {
      this.movies = data

      console.log( this.movies )
    },
    (error) => console.log(`Error`),
     () => console.log( `Complete` ) );
  }

  info( id: number ){
    localStorage.setItem('id', `${id}`)
    let waitingNav = debounce(() => {
      this.router.navigate(['info']);
    }, 3000);
    waitingNav();
  }

}
