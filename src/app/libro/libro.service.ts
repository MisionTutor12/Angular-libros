import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Libro } from './libro';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class LibrosService {
  LibroesUrl = 'http://127.0.0.1:5000/app';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LibrosService');
  }

  /** GET Libroes from the server */
  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.LibroesUrl}/libros`)
      .pipe(
        catchError(this.handleError('getLibros', []))
      );
  }

  /* GET Libroes whose name contains search term */
  searchLibroes(term: string): Observable<Libro[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Libro[]>(this.LibroesUrl, options)
      .pipe(
        catchError(this.handleError<Libro[]>('searchLibros', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new Libro to the database */
  addLibro(Libro: Libro): Observable<Libro> {
    const url = `${this.LibroesUrl}/libro`;
    return this.http.post<Libro>(url, Libro, httpOptions)
      .pipe(
        catchError(this.handleError('addLibro', Libro))
      );
  }

  /** DELETE: delete the Libro from the server */
  deleteLibro(id: number): Observable<unknown> {
    const url = `${this.LibroesUrl}/libro/${id}`; // DELETE api/Libroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteLibro'))
      );
  }

  /** PUT: update the Libro on the server. Returns the updated Libro upon success. */
  updateLibro(Libro: Libro): Observable<Libro> {
    const url = `${this.LibroesUrl}/libro/${Libro.serial}`;
    return this.http.put<Libro>(url, Libro, httpOptions)
      .pipe(
        catchError(this.handleError('updateLibro', Libro))
      );
  }
}