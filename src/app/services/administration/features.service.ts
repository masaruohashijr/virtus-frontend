import { Injectable } from '@angular/core';
import { FeatureDTO } from 'src/app/domain/dto/feature.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService extends BaseService<FeatureDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/features';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
