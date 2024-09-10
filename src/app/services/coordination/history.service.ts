import { Injectable } from '@angular/core';
import { HistoryComponentDTO } from 'src/app/domain/dto/history-component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from 'src/app/common/service-constants';
import { BaseService } from '../common/base.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends BaseService<HistoryComponentDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/history';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getHistory(entidadeId: number, cicloId: number, pilarId: number, componenteId: number): Observable<HistoryComponentDTO[]> {
    const params = new HttpParams()
      .set('entidadeId', entidadeId.toString())
      .set('cicloId', cicloId.toString())
      .set('pilarId', pilarId.toString())
      .set('componenteId', componenteId.toString());

    return this._httpClient.get<HistoryComponentDTO[]>(URL_API + `${this.rootEndpoint()}/list`, { params });
  }

}
