import { Injectable } from '@angular/core';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfficesService extends BaseService<OfficeDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/offices';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
