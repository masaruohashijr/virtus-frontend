import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from 'src/app/common/service-constants';
import { BaseDTO } from 'src/app/domain/common/base.dto';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';

export abstract class BaseService<T extends BaseDTO> {

  constructor() {
  }


  getAll(filter: any, page: number, size: number): Observable<PageResponseDTO<T>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter", filter);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient().get<PageResponseDTO<T>>(URL_API + this.rootEndpoint(), { params: queryParams });
  }

  getById(id: number): Observable<T> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this.getHttpClient().get<T>(URL_API + this.rootEndpoint() + '/by-id', { params: queryParams });
  }

  create(object: T): Observable<T> {
    return this.getHttpClient().post<T>(URL_API + this.rootEndpoint(), object);
  }

  update(object: T): Observable<T> {
    return this.getHttpClient().put<T>(URL_API + this.rootEndpoint(), object);
  }

  delete(id: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", id);
    return this.getHttpClient().delete(URL_API + this.rootEndpoint(), { params: queryParams });
  }

  abstract getHttpClient(): HttpClient;
  abstract rootEndpoint(): string;

}
