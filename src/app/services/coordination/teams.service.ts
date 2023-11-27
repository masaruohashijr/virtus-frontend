import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { HttpClient } from '@angular/common/http';
import { SupervisorDTO } from 'src/app/domain/dto/supervisor.dto';
import { URL_API } from 'src/app/common/service-constants';

@Injectable({
  providedIn: 'root'
})
export class TeamsService extends BaseService<TeamDTO>{


  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/teams';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getAllSupervisorsByCurrentId() {
    return this._httpClient.get<SupervisorDTO[]>(URL_API + this.rootEndpoint() + `/all-supervisors-by-current-user`);
  }
}
