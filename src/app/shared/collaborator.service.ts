import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError }  from 'rxjs/operators';
import { Collaborator } from '../model/collaborator';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public saveCollaborator( movie: any ): Observable<Collaborator>{
    return this.http.post<Collaborator>(`${this.apiURL}collaborators`,JSON.stringify(movie),this.httpOptions)
                    .pipe(
                      retry(1),
                      catchError(this.handleError)
                    );
  } 

  public listCollaborator(): Observable<Collaborator[]>{
    return this.http.get<Collaborator[]>(`${this.apiURL}collaborators`)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public findCollaboratorById( id: number ): Observable<Collaborator[]>{
    return this.http.get<Collaborator[]>(`${this.apiURL}collaborators/${id}`)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public updateCollaborator( movie: any ): Observable<Collaborator>{
    return this.http.patch<Collaborator>(`${this.apiURL}/collaborators`,JSON.stringify(movie),this.httpOptions)
                    .pipe(
                      retry(1),
                      catchError(this.handleError)
                    );
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
