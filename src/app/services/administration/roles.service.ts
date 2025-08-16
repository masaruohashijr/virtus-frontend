import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { RoleDTO } from 'src/app/domain/dto/role.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService<RoleDTO>{

  constructor(@Inject(HttpClient) private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/roles';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
