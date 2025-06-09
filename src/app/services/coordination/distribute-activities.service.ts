import { Injectable } from "@angular/core";
import { BaseService } from "../common/base.service";
import { JurisdictionDTO } from "src/app/domain/dto/jurisdiction.dto";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DistributeActivitiesDTO } from "src/app/domain/dto/distribute-activities-dto";
import { Observable } from "rxjs";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";
import { URL_API } from "src/app/common/service-constants";
import { DistributeActivitiesTreeDTO } from "src/app/domain/dto/distribute-activities-tree-dto";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { ProductPlanDTO } from "src/app/domain/dto/product-plan.dto";

@Injectable({
  providedIn: "root",
})
export class DistributeActivitiesService extends BaseService<DistributeActivitiesDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/distribute-activities";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getAllDistributeActivities(
    filter: any,
    page: number,
    size: number
  ): Observable<PageResponseDTO<DistributeActivitiesDTO>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter", filter);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient().get<PageResponseDTO<DistributeActivitiesDTO>>(
      URL_API + this.rootEndpoint(),
      { params: queryParams }
    );
  }

  getDistributeActivitiesTreeByEntityAndCycleId(
    entityId: number,
    cycleId: number
  ) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    return this._httpClient.get<DistributeActivitiesTreeDTO>(
      URL_API + this.rootEndpoint() + "/by-entity-and-cycle-id",
      { params: queryParams }
    );
  }

  distributeActivities(activities: any) {
    return this._httpClient.post(URL_API + this.rootEndpoint(), activities);
  }

  listConfigPlans(
    entityId: number,
    cycleId: number,
    pillarId: number,
    componentId: number,
    pga: boolean
  ) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    queryParams = queryParams.append("pillarId", pillarId);
    queryParams = queryParams.append("componentId", componentId);
    queryParams = queryParams.append("pga", pga);
    return this._httpClient.get<PlanDTO[]>(
      URL_API + this.rootEndpoint() + "/config-plans",
      { params: queryParams }
    );
  }

  listConfiguredPlans(
    entityId: number,
    cycleId: number,
    pillarId: number,
    componentId: number
  ) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    queryParams = queryParams.append("pillarId", pillarId);
    queryParams = queryParams.append("componentId", componentId);
    return this._httpClient.get<ProductPlanDTO[]>(
      URL_API + this.rootEndpoint() + "/configured-plans",
      { params: queryParams }
    );
  }

  updateConfigPlans(body: any) {
    return this._httpClient.post(
      URL_API + this.rootEndpoint() + "/config-plans",
      body
    );
  }

  updateNewAuditorComponent(body: any): Observable<any> {
    return this._httpClient.post(
      URL_API + this.rootEndpoint() + "/udpateNewAuditorComponent",
      body
    );
  }

  updateReschedullingComponent(body: any): Observable<any> {
    return this._httpClient.post(
      URL_API + this.rootEndpoint() + "/updateReschedullingComponent",
      body
    );
  }
}
