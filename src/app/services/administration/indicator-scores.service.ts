import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IndicatorScoreDTO } from "src/app/domain/dto/indicator-scores.dto";
import { BaseService } from "../common/base.service";

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
}
