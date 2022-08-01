import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { debounce, min } from 'lodash';
import { Collaborator } from 'src/app/model/collaborator';
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
  collaborator?: Collaborator;
  id!:number;
  submitted = false;
  private file: File | null = null;
  private readonly notifier: NotifierService;

  optionGenre: Genre[] = [
    { name: `` },
    { name: `AÇÃO` },
    { name: `AVENTURA` },
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
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef) {
                this.notifier = notifierService;                
                if( typeof sessionStorage.getItem('session') !=  null){      
                  this.collaborator = JSON.parse( sessionStorage.getItem('session') as any ) as Collaborator;
                  this.validForm();   
                }
              }

  ngOnInit(): void {

    this.action = localStorage.getItem('action');
    
    switch (this.action) {
      case 'find':

        if( localStorage.getItem('id') != null ){      
          this.id = JSON.parse( localStorage.getItem('id') as any ) as number;
          this.findMovieById( this.id );
        }         

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
    //console.log( `Form is ${this.formMovie.invalid}` );
    //console.log(!this.formMovie.value);
    //console.log(this.formMovie.controls);
    
    // Form is valid
    if(!this.formMovie.invalid){
      console.log(this.formMovie.value);

      switch (this.action) {
        case 'save':
          console.log( this.formMovie.value );
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
        this.showNotification('success', 'Filme atualizado!!!');
        this.hideOldestNotification();
        localStorage.setItem('action', 'save');
        this.router.navigate(['info']);
      }else{
        this.showNotification('error', 'Erro ao atualizar filme!!!')
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
      avaliation:       [0, ''],
      authors:          ['', Validators.required],
      year:             [0, Validators.required],      
      collaborator_id:  [this.collaborator!.id, Validators.required],
      url:              [null, ''],
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

  inputFileChange( event: any ){
    //console.log( `adicionado algo` )

    console.log( event.target.files[0] )
    // Verifica se tem algum arquivo
    if( event.target.files && event.target.files[0] ){
      //const foto = event.target.files[0];
      //this.file = foto;
      //const formData = new FormData();
      //formData.append('imagem', foto);
      
      //this.restApi.uploadImage( formData ).subscribe((data: {}) => {
        //console.log( data )
      //});
      
      let reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.formMovie.patchValue({
          url: reader.result
        });
        
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    } 
  } 

  // Verificacao campos obrigatórios
  get requiredFiels(){
    return this.formMovie.controls;
  }

}
