import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError }  from 'rxjs/operators';
import { Movie } from '../model/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public saveMovie( movie: any ): Observable<Movie>{
    return this.http.post<Movie>(`${this.apiURL}movies`,JSON.stringify(movie),this.httpOptions)
                    .pipe(
                      retry(1),
                      catchError(this.handleError)
                    );
  } 

  public listMovie(): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.apiURL}movies`)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public findMovieById( id: number ): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.apiURL}movies/${id}`)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  public updateMovie( movie: any ): Observable<Movie>{
    return this.http.patch<Movie>(`${this.apiURL}/movies`,JSON.stringify(movie),this.httpOptions)
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
