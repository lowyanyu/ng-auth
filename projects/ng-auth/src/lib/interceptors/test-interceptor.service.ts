import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

@Injectable()
export class TestInterceptorService {

  constructor(
    private http: HttpClient
  ) {}

  login(): Observable<any> {
    return this.http.post<any>('http://localhost/rest/management/login', {}, httpOptions).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>('http://localhost/rest/management/refresh', {}, httpOptions).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  getRequest(): Observable<any> {
    return this.http.get<any>('http://localhost/rest/management/user').pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  postRequest(): Observable<any> {
    return this.http.post<any>('http://localhost/rest/management/user', {}, httpOptions).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

}
