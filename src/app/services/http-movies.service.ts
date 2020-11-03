import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Movie} from '../models/movie';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpMoviesService {

  private url = 'http://localhost:3000/movies'; // pole z adresem do Backendu

  constructor(private http: HttpClient) {
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.url).
    pipe(tap(console.log)); // do debugowania
  }

  // Dodatkowe konfiguracje w zapytaniu - jak pobrac wiecej info
  // getMovies(): Observable<HttpResponse<Movie[]>> {
  //   return this.http.get<HttpResponse<Movie[]>>(this.url, {observe: 'response'}).
  //   pipe(tap(console.log)); // do debugowania
  // }

  postMovie(movie: Movie){
    return this.http.post(this.url, movie).
    pipe(tap(console.log));
  }

  putMovie(movie: Movie){
    return this.http.put(this.url + '/' +movie.id, movie).
    pipe(tap(console.log));
  }

  patchMovie(movie: Partial<Movie>){
    return this.http.patch(this.url + '/' +movie.id, movie).
    pipe(tap(console.log));
  }

  deleteMovie(id: string): Observable<{}>{
    return this.http.delete<{}>(this.url + '/' +id).
    pipe(tap(console.log));
  }

  makeError(): Observable<HttpErrorResponse> {
    return this.http
      .delete(this.url + '/' + 999)
      .pipe(tap(console.log), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never>{
    console.error(
      'Name: ${error.name} \n'+
      'Message: ${error.message} \n'+
      'Returned code: ${error.status} \n'
    );

    return throwError('Something bad happened; please try again later.');
  }

  headers(): Observable<HttpResponse<Movie[]>> {
    // Tworzenie wlasnych naglowkow i wysylanie ich

    const myHeaders = new  HttpHeaders({
      Authorization: 'my_token', // do przesylania tokenow autoryzacji
      'Content-Type': 'application/json', // wskazuje serwerowi w jakim formacie dane przesylamy, w metodzie GET nie ma to znaczenia
      'X-Custom-Header': 'zacznij_programowac', // wlasny naglowek
    })

    // Odbieranie naglowkow z serwera
    return this.http
        .get<Movie[]>(this.url, {observe: 'response', headers: myHeaders})
        .pipe(
          tap((res: HttpResponse<Movie[]>) => {
            console.log(res.headers.keys());
            console.log(res.headers.get('Cache-Control'));
            console.log(res.headers.get('Content-Type'));
            console.log(res.headers.get('Expires'));
            console.log(res.headers.get('Pragma'));
          })
        );

  }

  // odbiera posortowana liste filmow po tytule
  params(): Observable<Movie> {
    const myParams = new HttpParams()
    .set('_sort','title')
    .set('_order','desc');

    return this.http
      .get<Movie[]>(this.url, {params: myParams})
      .pipe(tap(console.log));
  }

}
