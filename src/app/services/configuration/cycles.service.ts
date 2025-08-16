import { Inject, Injectable } from "@angular/core";
import { CycleDTO } from "src/app/domain/dto/cycle.dto";
import { BaseService } from "../common/base.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { StartCycleDTO } from "src/app/domain/dto/start-cycle.dto";
import { URL_API } from "src/app/common/service-constants";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";

@Injectable({
  providedIn: "root",
})
export class CyclesService extends BaseService<CycleDTO> {
  constructor(@Inject(HttpClient) private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/cycles";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  startCycle(object: StartCycleDTO) {
    return this.getHttpClient().post<void>(
      URL_API + this.rootEndpoint() + "/start-cycle",
      object
    );
  }

  removeCycleProducts(object: StartCycleDTO) {
    return this.getHttpClient().post<void>(
      URL_API + this.rootEndpoint() + "/remove-cycle-products",
      object
    );
  }

  getAllByEntityId(entityId: number, page: number, size: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    return this.getHttpClient().get<PageResponseDTO<CycleDTO>>(
      URL_API + this.rootEndpoint() + "/by-entity",
      { params: queryParams }
    );
  }
}
