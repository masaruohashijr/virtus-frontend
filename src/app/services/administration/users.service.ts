import { Injectable } from '@angular/core';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<UserDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/users';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
