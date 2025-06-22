import { Injectable } from "@angular/core";
import { URL_API } from "src/app/common/service-constants";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../common/base.service";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlansService extends BaseService<PlanDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/plans";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getByEntityId(entityId: number) {
    return this._httpClient.get<PlanDTO[]>(
      `${URL_API}${this.rootEndpoint()}/by-entity/${entityId}`
    );
  }

  getByCnpb(cnpb: string): Observable<PlanDTO> {
    return this.getHttpClient().get<PlanDTO>(
      `${URL_API}${this.rootEndpoint()}/cnpb/${cnpb}`
    );
  }
}
