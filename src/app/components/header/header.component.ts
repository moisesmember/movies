import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collaborator } from '../../model/collaborator';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collaborator?: Collaborator;
  constructor(
    public router: Router,
    public restApi: AuthenticationService
  ) {
    if( typeof sessionStorage.getItem('session') !=  null){      
      this.collaborator = JSON.parse( sessionStorage.getItem('session') as any ) as Collaborator;
      //console.log( JSON.parse( sessionStorage.getItem('session') as any ).name );
      //console.log( this.collaborator!.username );     
    }
    
  }

  ngOnInit(): void {
  }

  logoff(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
