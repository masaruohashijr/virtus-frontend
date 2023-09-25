import { Injectable } from '@angular/core';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';
import { UserUpdatePasswordDTO } from 'src/app/domain/dto/user-update-password.dto';
import { URL_API } from 'src/app/common/service-constants';

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

  updatePassword(body: UserUpdatePasswordDTO) {
    return this._httpClient.put(URL_API + this.rootEndpoint() + '/update-password', body);
  }
}
