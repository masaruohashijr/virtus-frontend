import { Injectable } from '@angular/core';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { BaseService } from '../common/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JurisdictionDTO } from 'src/app/domain/dto/jurisdiction.dto';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { Observable } from 'rxjs';
import { URL_API } from 'src/app/common/service-constants';
import { MemberDTO } from 'src/app/domain/dto/member.dto';

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

  getJurisdictionsByOfficeId(
    filter: any,
    officeId: number,
    page: number,
    size: number): Observable<PageResponseDTO<JurisdictionDTO>> {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter", filter);
    queryParams = queryParams.append("officeId", officeId);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient()
      .get<PageResponseDTO<JurisdictionDTO>>(URL_API + this.rootEndpoint() + "/jurisdictions", { params: queryParams });
  }

  getMembersByOfficeId(
    filter: any,
    officeId: number,
    page: number,
    size: number): Observable<PageResponseDTO<MemberDTO>> {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter", filter);
    queryParams = queryParams.append("officeId", officeId);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient()
      .get<PageResponseDTO<MemberDTO>>(URL_API + this.rootEndpoint() + "/members", { params: queryParams });
  }

  updateJurisdictions(object: OfficeDTO): Observable<OfficeDTO> {
    return this.getHttpClient().put<OfficeDTO>(URL_API + this.rootEndpoint() + "/jurisdictions", object);
  }

  updateMembers(object: OfficeDTO): Observable<OfficeDTO> {
    return this.getHttpClient().put<OfficeDTO>(URL_API + this.rootEndpoint() + "/members", object);
  }

}
