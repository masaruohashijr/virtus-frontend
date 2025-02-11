import { Injectable } from '@angular/core';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseService } from '../common/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserUpdatePasswordDTO } from 'src/app/domain/dto/user-update-password.dto';
import { URL_API } from 'src/app/common/service-constants';
import { Observable } from 'rxjs';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { CurrentUser } from 'src/app/domain/dto/current-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<UserDTO>{

  currentUser!: CurrentUser;

  constructor(private _httpClient: HttpClient) {
    super();
  }

  setCurrentUser(user: CurrentUser) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
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

  getAllNotMember(page: number, size: number): Observable<PageResponseDTO<UserDTO>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient().get<PageResponseDTO<UserDTO>>(URL_API + this.rootEndpoint() + '/not-member', { params: queryParams });
  }

  getAllByRole(roleId: number): Observable<UserDTO[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("roleId", roleId);
    return this.getHttpClient().get<UserDTO[]>(URL_API + this.rootEndpoint() + '/by-role', { params: queryParams });
  }
}
