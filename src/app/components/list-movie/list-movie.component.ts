import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    public router: Router,
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
    this.router.navigate(['/info']);
  }

}
