import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';

@Injectable({
  providedIn: 'root'
})
export class GradeTypeService extends BaseService<GradeTypeDTO> {

  constructor(@Inject(HttpClient) private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/grade-types';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
