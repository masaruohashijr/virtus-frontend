import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { ActionDTO } from 'src/app/domain/dto/action.dto';

@Injectable({
  providedIn: 'root'
})
export class ActionsService extends BaseService<ActionDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/actions';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
