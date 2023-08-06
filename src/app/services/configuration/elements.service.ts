import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElementDTO } from 'src/app/domain/dto/element.dto';
import { BaseService } from '../common/base.service';

@Injectable({
  providedIn: 'root'
})
export class ElementsService extends BaseService<ElementDTO> {


  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/elements';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
