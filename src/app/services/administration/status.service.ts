import { Injectable } from '@angular/core';
import { StatusDTO } from 'src/app/domain/dto/status.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusService  extends BaseService<StatusDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/status';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
