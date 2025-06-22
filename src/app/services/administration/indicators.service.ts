import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { BaseService } from "../common/base.service";

export interface IndicatorsService {
  id: number;
  indicatorAcronym: string;
  indicatorName: string;
  indicatorDescription: string;
}

@Injectable({
  providedIn: "root",
})
export class IndicatorsService extends BaseService<IndicatorDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
  override rootEndpoint(): string {
    return "/indicators";
  }
}
