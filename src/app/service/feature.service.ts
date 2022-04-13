import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../global-constants';

export class Feature {
  name?: string;
  code?: string;
  description?: string;
}

/*
SELECT feature.id,
    feature.author_id,
    usuario.name as autor,
    feature.code,
    feature.created_at,
    feature.description,
    feature.id_versao_origem,
    feature.name,
    feature.status_id,
    status.name
FROM virtus.feature
INNER JOIN
    virtus.user AS usuario ON virtus.feature.author_id = usuario.author_id
      INNER JOIN
  virtus.status AS status ON virtus.feature.status_id = status.status_id
*/


@Injectable({
  providedIn: 'root'
})

export class FeatureService {

  endpoint = GlobalConstants.apiURL;
  constructor(private httpClient: HttpClient) {}
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getFeature(): Observable<Feature> {
    return this.httpClient
      .get<Feature>(this.endpoint + '/feature/list')
      .pipe(retry(1), catchError(this.processError));
  }

  getSingleFeature(id: any): Observable<Feature> {
    return this.httpClient
      .get<Feature>(this.endpoint + '/feature/' + id)
      .pipe(retry(1), catchError(this.processError));
  }

  addFeature(data: any): Observable<Feature> {
    return this.httpClient
      .post<Feature>(
        this.endpoint + '/feature',
        JSON.stringify(data),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  updateFeature(id: any, data: any): Observable<Feature> {
    return this.httpClient
      .put<Feature>(
        this.endpoint + '/feature/' + id,
        JSON.stringify(data),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  deleteFeature(id: any) {
    return this.httpClient
      .delete<Feature>(this.endpoint + '/feature/' + id, this.httpHeader)
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