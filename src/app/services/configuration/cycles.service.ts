import { Injectable } from '@angular/core';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CyclesService extends BaseService<CycleDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/cycles';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
