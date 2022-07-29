import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/shared/movie.service';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit {
  movie!: Movie[];
  id!: number;
  constructor(
    public restApi: MovieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if( localStorage.getItem('id') != null ){      
      this.id = JSON.parse( localStorage.getItem('id') as any ) as number;
      this.findMovieById( this.id );
    }
  }

  findMovieById = debounce(( id: number ) => {
    this.restApi.findMovieById( id )
                  .subscribe((data: Movie[]) => {
                      console.log( JSON.stringify(data) );
                      this.movie = data

                      console.log( this.movie[0]!.name )
                    });

                  }, 1000 );
  
  update(){
    localStorage.setItem('action', `find`)
    let waitingNav = debounce(() => {
      this.router.navigate(['movie']);
    }, 1000);
    waitingNav();
  }
}
