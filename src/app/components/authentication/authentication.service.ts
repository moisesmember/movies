import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Collaborator } from '../../model/collaborator';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

    // Login
  // { username: 'username', password: '*******' }
  public login(username?: String, password?: String): Observable<Collaborator>{ 
    return this.http.post<Collaborator>(`${this.apiURL}collaborators_login`,JSON.stringify({username: username, password: password}),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
                              
  }

  public logoff(): Observable<Collaborator>{
    return this.http.get<Collaborator>(`logout`)
                      .pipe(
                        retry(1),
                        catchError(this.handleError)
                      )      
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
