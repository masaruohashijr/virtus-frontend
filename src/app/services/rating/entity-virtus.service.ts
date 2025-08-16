import { Inject, Injectable } from '@angular/core';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { BaseService } from '../common/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CycleEntityDTO } from 'src/app/domain/dto/cycle-entity.dto';
import { URL_API } from 'src/app/common/service-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityVirtusService extends BaseService<EntityVirtusDTO> {

  constructor(@Inject(HttpClient) private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/entities';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getCyclesEntityByEntityId(entityId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    return this._httpClient.get<CycleEntityDTO[]>(
      URL_API + this.rootEndpoint() + "/cycle-entity/by-entity-id",
      { params: queryParams });
  }

  getAllAvailable(): Observable<EntityVirtusDTO[]> {
    return this._httpClient.get<EntityVirtusDTO[]>(
      URL_API + this.rootEndpoint() + "/jurisdiction/available", {});
  }
}
