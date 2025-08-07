import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IndicatorScoreDTO } from "src/app/domain/dto/indicator-score.dto";
import { BaseService } from "../common/base.service";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";

@Injectable({
  providedIn: "root",
})
export class IndicatorScoresService extends BaseService<IndicatorScoreDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  override rootEndpoint(): string {
    return "/indicator-scores";
  }

  fetchLastReference(): Observable<any> {
    const endpoint =
      `${URL_API}` +
      this.rootEndpoint() +
      `/last-reference`.replace(/([^:]\/)\/+/g, "$1");
    console.log("URL final para buscar última referência:", endpoint);
    return this.getHttpClient().get<String>(endpoint);
  }

  syncScores(refDate: string | null | undefined): Observable<Object> {
    if (!refDate) {
      throw new Error("referenceDate não pode ser nulo ou indefinido");
    }

    return this._httpClient.post(`${URL_API}` +`${this.rootEndpoint()}/syncScores`, {
      referenceDate: refDate,
    });
  }
}
