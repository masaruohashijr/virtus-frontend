import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { BaseService } from "../common/base.service";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";

@Injectable({
  providedIn: "root",
})
export class IndicatorsService extends BaseService<IndicatorDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/indicators";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  syncIndicators(): Observable<any> {
    const endpoint = `${URL_API}${this.rootEndpoint()}/sync`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
    console.log("URL final de sincronização:", endpoint);
    return this.getHttpClient().get<IndicatorDTO>(endpoint);
  }

}
