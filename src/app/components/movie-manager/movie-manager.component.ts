import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
              private activatedRoute: ActivatedRoute,) {
                this.notifier = notifierService;                
                if( typeof sessionStorage.getItem('session') !=  null){      
                  this.collaborator = JSON.parse( sessionStorage.getItem('session') as any ) as Collaborator;
                  this.validForm();   
                }
              }

  ngOnInit(): void {

    //localStorage.setItem('action', 'find');
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
      //collaborator_id:  [15, Validators.required],
      collaborator_id:  [this.collaborator!.id, Validators.required],
      url:              ['https://app-movie-catalog.s3.us-east-1.amazonaws.com/stand.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXNhLWVhc3QtMSJHMEUCIQC9P4fQ5%2BnFxRL22cQwJeYwgD4VniLiv%2BfzrKIVySU1hQIgLE5mazFVjtz6m1efKi1FBl47UptdshGPg8HtPxKb35gq7QII%2Fv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgwwMTgzMDE4MzI3MzQiDCHWdGrFeMoC3RJPjCrBAqgNn9jNO3Bg4md1%2BxmKs%2Fejd%2Bg0KKnXlkyIhPJr3ZbiJMKM3pYk5RUPznifgZ25%2FREdAVSsZ%2BYtYH1ceLX5A%2FHXl44w3mtunrp%2BAC0BJK42QCBXrM9Nsj1onq5DLIVP1Udmfzqflo1qtjAmhzJAWGa0qlU3AFYRRCklH5Vs4aCD5xTY44nc8e0h11yyOLPpvF4%2BNEnE9mhQsTxbHVL0AQwADvIwPgGTotc5NvFY1iH4oBcO8fBpr7znUexSTRFx%2Fkw7A9gaBBELFgOulEAs0qdt4mWW9cEhpO7zKhi7ylm84HdBaEP5LFWQvFMuUfUiJKMe0e8sn6booXCL1Q7x497tY184JbYrf%2FxhFFNKJJEBX5gYBYS5CtB36X9hAVbLZ0vzczmLNuinkOAUTsAzbiK%2FQF3xNyDZmV8PMKRLoITf5DCRyY2XBjqzAtA05V0NYHDtg2%2BOjxIArvOg91WfSiexnrgZUHH5gJH4UGwbaXejN3DIbTI498XPmJaEU4iAYbkbq8F2vbP11WsVi2fj7CI7FzaiM%2FpXFqs817QqtReEMSSEixpPkbrEdGk5%2FoCTzFFCXypeTP3q2Kw50SrANmuSgRQN7WBfNh1d9ZFet2RlpM4trWWble%2BhCulGOzCHZcCbUWvfJCffGkHWbKB9KNJ1Il9l4vD7EeJ3LMU%2B0qDJm3Gybpyj5MzKtTlO%2Fh%2BmcBmV3h%2BAFOglSKOX5xEwkfl6UtLjD4kjV4C7RuO%2F4Xl4KyK45N33Mdr7DjVNV5th%2FtgWUNgUpcAziAsqvWi7XZEN4JHIGLUculKSRuAXAw%2BAX4G9OQA7mzkr5KCb88qZF3jOwRqgr70%2BKv2zDZ8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220729T050139Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQIQW7ZYPB26ZMCUV%2F20220729%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=32bb46daef89426be43b98a61e6cf2569fafca3d2218d6f5e3860c16f7c7e36e', Validators.required],
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
    console.log( `adicionado algo` )

    console.log( event.target.files[0] )
    // Verifica se tem algum arquivo
    if( event.target.files && event.target.files[0] ){
      const foto = event.target.files[0];

      const formData = new FormData();
      formData.append('imagem', foto);

      this.restApi.uploadImage( formData ).subscribe((data: {}) => {
        console.log( data )
      });
    }
  }

}
