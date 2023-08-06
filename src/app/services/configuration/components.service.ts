import { Injectable } from '@angular/core';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService extends BaseService<ComponentDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/components';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
