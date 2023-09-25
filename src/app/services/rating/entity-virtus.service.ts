import { Injectable } from '@angular/core';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityVirtusService extends BaseService<EntityVirtusDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/entities';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
