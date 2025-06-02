import { Injectable } from '@angular/core';
import { ProductComponentHistoryDTO } from 'src/app/domain/dto/product-component-history.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from 'src/app/common/service-constants';
import { BaseService } from '../common/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductComponentHistoryService extends BaseService<ProductComponentHistoryDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/product-component-history';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getHistory(entidadeId: number, cicloId: number, pilarId: number, componenteId: number): Observable<ProductComponentHistoryDTO[]> {
    const params = new HttpParams()
      .set('entidadeId', entidadeId.toString())
      .set('cicloId', cicloId.toString())
      .set('pilarId', pilarId.toString())
      .set('componenteId', componenteId.toString());

    return this._httpClient.get<ProductComponentHistoryDTO[]>(URL_API + `${this.rootEndpoint()}/list`, { params });
  }

}
