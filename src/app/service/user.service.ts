import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../global-constants';

export class User {

  username?: string;
  password?: string;
  email?: string;
  mobile?: string;
  name?: string;
  role_id?: number;
}

@Injectable({
  providedIn: 'root'
})

/**
SELECT action.id,
    action.author_id,
    usuario.name,
    action.created_at,
    action.description,
    action.destination_status_id,
    action.id_versao_origem,
    action.name,
    action.origin_status_id,
    action.other_than,
    action.status_id,
    status.name
FROM virtus.action
      INNER JOIN
  virtus.user AS usuario ON virtus.action.author_id = usuario.author_id
      INNER JOIN
  virtus.status AS status ON virtus.action.status_id = status.status_id
*/


export class UserService {

  endpoint = GlobalConstants.apiURL;
  constructor(private httpClient: HttpClient) {}
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getUsers(): Observable<User> {
    return this.httpClient
      .get<User>(this.endpoint + '/user/list')
      .pipe(retry(1), catchError(this.processError));
  }

  getSingleUser(id: any): Observable<User> {
    return this.httpClient
      .get<User>(this.endpoint + '/user/' + id)
      .pipe(retry(1), catchError(this.processError));
  }

  addUser(data: any): Observable<User> {
    return this.httpClient
      .post<User>(
        this.endpoint + '/user',
        JSON.stringify(data),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  updateUser(id: any, data: any): Observable<User> {
    return this.httpClient
      .put<User>(
        this.endpoint + '/user/' + id,
        JSON.stringify(data),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  deleteUser(id: any) {
    return this.httpClient
      .delete<User>(this.endpoint + '/user/' + id, this.httpHeader)
      .pipe(retry(1), catchError(this.processError));
  }

  processError(err: any) {
    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(() => {
      message;
    });
  }
}