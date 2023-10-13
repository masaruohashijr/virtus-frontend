import { Injectable } from '@angular/core';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';
import { StartCycleDTO } from 'src/app/domain/dto/start-cycle.dto';
import { URL_API } from 'src/app/common/service-constants';

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

  startCycle(object: StartCycleDTO) {
    return this.getHttpClient().post<void>(URL_API + this.rootEndpoint() + '/start-cycle', object);
  }
}
