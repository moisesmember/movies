import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { debounce, min } from 'lodash';
import { Movie } from 'src/app/model/movie';

import { Genre } from '../../model/genre';
import { MovieService } from '../../shared/movie.service';

@Component({
  selector: 'app-movie-manager',
  templateUrl: './movie-manager.component.html',
  styleUrls: ['./movie-manager.component.css']
})
export class MovieManagerComponent implements OnInit {

  formMovie!: FormGroup;
  action: string | null = 'save'; 
  private readonly notifier: NotifierService;

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
              notifierService: NotifierService,
              public formbuilder: FormBuilder,
              public dataFormata: DatePipe,
              private activatedRoute: ActivatedRoute,) {
                this.notifier = notifierService;
                this.validForm();
              }

  ngOnInit(): void {

    localStorage.setItem('action', 'find');

    this.action = localStorage.getItem('action');
    
    switch (this.action) {
      case 'find':


          this.findMovieById( 1 );

        break;
    
      default:
        break;
    }

  }

  findMovieById = debounce(( id: number ) => {
    this.restApi.findMovieById( id )
                  .subscribe((data: Movie[]) => {
                      console.log( JSON.stringify(data) );
                       
                     this.formMovie.setValue({
                      id:                data[0].id,
                      name:              data[0].name,
                      description:       data[0].description,
                      sinopse:           data[0].sinopse,
                      avaliation:        data[0].avaliation,
                      authors:           data[0].authors,
                      genre:             data[0].genre,
                      year:              data[0].year,
                      collaborator_id:   data[0].collaborator_id,
                      url:               data[0].url,
                     }); 

                  });

  }, 1000 );

  onSubmit(){
    // Form is valid
    if(this.formMovie.invalid){
      console.log(this.formMovie.value);

      switch (this.action) {
        case 'save':
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
          break;
      
        default:

          this.updateMovie({
            id:               this.formMovie.value.id,
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

        break;
      }

    }
  }

  createMovie(movie: {}){
    this.restApi.saveMovie( movie ).subscribe((data: {}) => {
      if(data != null || data == undefined){  
        this.showNotification('success', 'Filme adicionado!!!');
        this.hideOldestNotification();
      }else{
        this.showNotification('error', 'Erro ao adicionar filme!!!')
      }
    });
  }

  updateMovie(movie: {}){
    this.restApi.updateMovie( movie ).subscribe((data: {}) => {
      if(data != null || data == undefined){  
        this.showNotification('success', 'Filme adicionado!!!');
        this.hideOldestNotification();
      }else{
        this.showNotification('error', 'Erro ao adicionar filme!!!')
      }
    });
  };

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

  /**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

  /**
	 * Hide oldest notification
	 */
	public hideOldestNotification(): void {
		this.notifier.hideOldest();
	}

}
