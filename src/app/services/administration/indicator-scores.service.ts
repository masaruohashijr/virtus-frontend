import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IndicatorScoreDTO } from "src/app/domain/dto/indicator-score.dto";
import { BaseService } from "../common/base.service";

@Injectable({
  providedIn: "root",
})
export class IndicatorScoresService extends BaseService<IndicatorScoreDTO> {
  
  syncScores(refDate: string | null | undefined) {
    if (!refDate) return;
    return this._httpClient.post(`${this.rootEndpoint()}/sync`, {
      referenceDate: refDate,
    });
  }
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
