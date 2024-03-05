import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { JurisdictionDTO } from 'src/app/domain/dto/jurisdiction.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DistributeActivitiesService extends BaseService<JurisdictionDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/distribute-activities';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
