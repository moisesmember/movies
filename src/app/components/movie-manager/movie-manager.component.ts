import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce, min } from 'lodash';

import { Genre } from '../../model/genre';
import { MovieService } from '../../shared/movie.service';

@Component({
  selector: 'app-movie-manager',
  templateUrl: './movie-manager.component.html',
  styleUrls: ['./movie-manager.component.css']
})
export class MovieManagerComponent implements OnInit {

  formMovie!: FormGroup;

  optionGenre: Genre[] = [
    { name: `` },
    { name: `AÇÃO` },
    { name: `COMÉDIA` },
    { name: `DRAMA` },
    { name: `INFANTIL` },
    { name: `ROMANCE` },
    { name: `TERROR` },      
  ];

  constructor(
              public restApi: MovieService,
              public router: Router,
              public formbuilder: FormBuilder,
              public dataFormata: DatePipe,
              private activatedRoute: ActivatedRoute,) {
                this.validForm();
              }

  ngOnInit(): void {
  }

  findMovieById = debounce(( id: number ) => {
    this.restApi.findMovieById( id )
                  .subscribe((data:{}) => {

                     /*this.formMovie.setValue({
                      id:                data[0].id,
                      name:              data[0].name,
                      description:       data[0].description,
                      sinopse:           data[0].sinopse,
                      avaliation:        data[0].avaliation,
                      authors:           data[0].authors,
                      genre:             data[0].genre,
                      year:              data[0].year,
                      collaborator_id:   data[0]..collaborator_id,
                      url:               data[0].url,
                     }); */

                  });

  }, 1000 );

  onSubmit(){
    // Form is valid
    if(this.formMovie.invalid){
      console.log(this.formMovie.value);

      this.createMovie({
        name:             this.formMovie.value.name,
        description:      this.formMovie.value.description,
        sinopse:          this.formMovie.value.sinopse,
        avaliation:       this.formMovie.value.avaliation,
        authors:          this.formMovie.value.authors,
        genre:            this.formMovie.value.genre,
        year:             this.formMovie.value.year,
        collaborator_id:  this.formMovie.value.collaborator_id,
        url:              this.formMovie.value.url,
      });

    }
  }

  createMovie(movie: {}){
    this.restApi.saveMovie( movie ).subscribe((data: {}) => {
      if(data != null || data == undefined){  console.log( data )   } 
    });
  }

  validForm(){
    this.formMovie = this.formbuilder.group({
      id:               [0, ''],
      name:             ['', Validators.required],
      description:      ['', Validators.required],
      sinopse:          ['', Validators.required],
      genre:            [this.optionGenre[0].name, Validators.required],
      avaliation:       [0, Validators.required],
      authors:          ['', Validators.required],
      year:             [0, Validators.required],
      collaborator_id:  [1, Validators.required],
      url:              ['', Validators.required],
    });
  };

}
