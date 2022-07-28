import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { NotifierService } from 'angular-notifier';
import { Collaborator } from '../../model/collaborator';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  @Input() formLogin!: FormGroup;
  @Input() formAccount!: FormGroup;
  private readonly notifier: NotifierService;

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
    public router: Router,
    public restApi: AuthenticationService,
    private formBuilder: FormBuilder,
    notifierService: NotifierService) {
      this.notifier = notifierService;
      this.formLogin = this.formBuilder.group(this.loginCredentials);
      this.formAccount = this.formBuilder.group(this.registerCredentials);
  }

  ngOnInit(): void {
  }

  
  login(){
    console.log(this.loginCredentials);
    this.restApi.login(this.loginCredentials.username, this.loginCredentials.password).subscribe((data: Collaborator) => {
      if( data != null || data != undefined ){ 
        console.log( data )
      }
    })
  /*  
    this.showNotification('warning', 'Por favor aguarde, carregando ...');
    this.restApi.login(this.loginCredentials.email, this.loginCredentials.password).subscribe((data: Collaborator) => {
        //console.log(data);
        if( data != null || data != undefined ){ // Se não for vazio          
          if( data.success ){            
            if( data.message == 'Unauthorised' ){
              // Usuário não cadastrado OU com alguma credencial Errada
              this.hideOldestNotification();
              this.showNotification('error', 'Não foi possível acessar.\n\n Motivos: Credenciais erradas, usuário não cadastrado ou não aprovado.')
            }else{
              // Acesso normal ao Sistema              
              //sessionStorage.setItem(`session`, JSON.stringify(data));              
              //this.findUser(data);
            }
          }else{
            this.hideOldestNotification();
            this.showNotification('error', 'Não foi possível acessar.\n\n Motivos: Credenciais erradas, usuário não cadastrado ou não aprovado.')
          }
          //console.log(data.message);
          //console.log(data.success);
        }
    },
    (error) => this.showNotification('error', 'Não foi possível adicionar evento!!!'),
    () => console.log(``));  */
  }

  logoff(){
    this.restApi.logoff().subscribe((data: Collaborator) => {
      if( data != null || data != undefined ){ // Se não for vazio
      console.log(`LOGOFF`);
      console.log(data);
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
    /*this.restApi.createUser({
      email:    this.registerCredentials.email,
      name:     this.registerCredentials.name,
      password: this.registerCredentials.password,
      status:   0
    }).subscribe((data: {}) => {
      if(data != null || data == undefined){ 
        sessionStorage.setItem('session', this.registerCredentials.name);
       } 
    },
    (error)=> this.showNotification('error', 'Não foi possível cadastrar perfil.'),
    () => {this.showNotification('success', 'Perfil cadastrado e disponibilidade para análise!');
            this.router.navigate(['/notification']);
          });*/
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
