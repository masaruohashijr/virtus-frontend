import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SupervisorDTO } from 'src/app/domain/dto/supervisor.dto';
import { URL_API } from 'src/app/common/service-constants';
import { TeamMemberDTO } from 'src/app/domain/dto/team-member.dto';
import { MemberDTO } from 'src/app/domain/dto/member.dto';

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

  assignTeam(object: TeamDTO) {
    return this._httpClient.post(URL_API + this.rootEndpoint() + `/assign-team`, object);
  }

  getSupervisorByTeam(entityId: number, cycleId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    return this.getHttpClient().get<SupervisorDTO>(URL_API + this.rootEndpoint() + "/supervisor", { params: queryParams });
  }

  getTeamMembersByTeam(entityId: number, cycleId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    return this.getHttpClient().get<TeamMemberDTO[]>(URL_API + this.rootEndpoint() + "/team-members", { params: queryParams });
  }

  validateTeamMember(cycleId: any, userTeamMemberId: any, supervisorId: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("cycleId", Number.parseInt("" + cycleId));
    queryParams = queryParams.append("userTeamMemberId", Number.parseInt("" + userTeamMemberId));
    queryParams = queryParams.append("supervisorId", Number.parseInt("" + supervisorId));
    return this.getHttpClient().get<TeamMemberDTO[]>(URL_API + this.rootEndpoint() + "/validate/team-member", { params: queryParams });
  }

  getAllMembersByBoss() {
    return this.getHttpClient().get<MemberDTO[]>(URL_API + this.rootEndpoint() + "/all-members-by-current-user");
  }
}
