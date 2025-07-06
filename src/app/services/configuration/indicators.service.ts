import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { IndicatorDTO } from 'src/app/domain/dto/indicator.dto';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService extends BaseService<IndicatorDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/indicators';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
