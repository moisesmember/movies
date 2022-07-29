import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CollaboratorService } from '../../shared/collaborator.service';
import { NotifierService } from 'angular-notifier';
import { Collaborator } from '../../model/collaborator';
import { Object } from '../../model/object';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  @Input() formLogin!: FormGroup;
  @Input() formAccount!: FormGroup;
  private readonly notifier: NotifierService;
  valid!: Object;
  typeForma: string | null= 'login'; // login or register

  loginCredentials = {
    username: '',
    password: ''
  };

  registerCredentials = {
    name: '',
    username: '',
    password: ''
  };
  constructor(    
    private router: Router,
    public restApi: AuthenticationService,
    public restApiCollaborator: CollaboratorService,
    private formBuilder: FormBuilder,
    notifierService: NotifierService) {
      this.notifier = notifierService;
      this.formLogin = this.formBuilder.group(this.loginCredentials);
      this.formAccount = this.formBuilder.group(this.registerCredentials);
  }

  ngOnInit(): void {
    //this.typeForma = localStorage.getItem('typeform');

    //console.log( localStorage.getItem('typeform') )
    if( localStorage.getItem('typeform') == null ){
      localStorage.setItem('typeform', 'login');
    }else{
      this.typeForma = localStorage.getItem('typeform');
    }

  }

  
  login(){
    //console.log(this.loginCredentials);
    this.showNotification('warning', 'Por favor aguarde, validando ...');
    if( this.loginCredentials.username != '' && 
        this.loginCredentials.password != '' ){
      this.restApi.login(this.loginCredentials.username, this.loginCredentials.password).subscribe((data: Object) => {
        if( data != null || data != undefined ){ 
          //console.log( data )        
          const result = JSON.parse( JSON.stringify(data) )[0].login;
          //console.log( JSON.parse( JSON.stringify(data) )[0].login );

          if( result == 1 ){
            //console.log( JSON.parse( JSON.stringify(data) )[0] )
            this.findCollaboratorsByUsername( this.loginCredentials.username, this.loginCredentials.password );
          }else{
            this.hideOldestNotification();
            this.showNotification('error', 'Não foi possível acessar.\n\n Motivos: Credenciais erradas, usuário não cadastrado ou campos vazios.')
          }

        }
      })
    }else{
      this.hideOldestNotification();
      this.showNotification('error', 'Preencha todos os campos.')
    }
  }

  logoff(){
    this.restApi.logoff().subscribe((data: Collaborator) => {
      if( data != null || data != undefined ){ // Se não for vazio
        //console.log(`LOGOFF`);
        //console.log(data);
        localStorage.clear();
        localStorage.setItem('typeform', 'login');
        sessionStorage.clear();
      }else{
        console.log(`LOGOFF HERE`);
        sessionStorage.clear();
      }      
    });
    sessionStorage.clear();
  }

  register(){
    this.showNotification('warning', 'Por favor aguarde, enviando perfil para análise ...');
    console.log( this.registerCredentials )
    
    if( this.registerCredentials.name != '' && 
        this.registerCredentials.username != '' && 
        this.registerCredentials.password != '' ){

      this.restApiCollaborator.saveCollaborator({
        name:     this.registerCredentials.name,
        username: this.registerCredentials.username,
        password: this.registerCredentials.password,
      }).subscribe((data: {}) => {
        if(data != null || data == undefined){ 
          //console.log( JSON.parse( JSON.stringify( data ) ).data )
          localStorage.removeItem('typeform');
          localStorage.setItem('typeform', 'login');
          const result = JSON.parse( JSON.stringify( data ) ).data;
          sessionStorage.setItem('session', JSON.stringify( result ) );
        } 
      },
      (error)=> this.showNotification('error', 'Não foi possível cadastrar perfil.'),
      () => {this.showNotification('success', 'Perfil cadastrado e disponibilidade para análise!');
              this.router.navigate(['/list']);
            });

    }else{
      this.hideOldestNotification();
      this.showNotification('error', 'Preencha todos os campos.')
    }
  }

  findCollaboratorsByUsername( username: string, password: string ){
    this.restApiCollaborator.findByUsername( username, password ).subscribe(data => {
      console.log( data );
      sessionStorage.clear();
      sessionStorage.setItem('session', JSON.stringify( JSON.parse( JSON.stringify(data) )[0] ) );
      this.router.navigate(['/list']); // Redirecionar 
    },
    (error) => console.log(`Error`),
     () => console.log( `Complete` ) );
  }

  redirect(view: string){
   //console.log( `REDIRECT ACESSAD` )   
   //this.typeForma = 'register';
   localStorage.setItem('typeform', view);
   //this.router.navigate(['/login']); // Redirecionar
  }

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
