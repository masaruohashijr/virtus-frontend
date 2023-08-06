import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { PillarDTO } from 'src/app/domain/dto/pillar.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PillarsService  extends BaseService<PillarDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/pillars';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
