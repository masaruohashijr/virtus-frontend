import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AutomaticScoreDTO } from "src/app/domain/dto/automatic-score.dto";
import { BaseService } from "../common/base.service";
import { URL_API } from "src/app/common/service-constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AutomaticScoresService extends BaseService<AutomaticScoreDTO> {

  constructor(@Inject(HttpClient) private _httpClient: HttpClient) {
    super();
  }

  /**
   * Chamada para gerar uma nota automática.
   * @param dto Dados contendo CNPB, data de referência e componente
   */
  generate(dto: AutomaticScoreDTO) {
    return this._httpClient.post(`${this.rootEndpoint()}/generate`, dto);
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  override rootEndpoint(): string {
    return "/automatic-scores";
  }

  calculateScores(refDate: string | null | undefined): Observable<Object> {
    if (!refDate) {
      throw new Error("referenceDate não pode ser nulo ou indefinido");
    }

    return this._httpClient.post(
      `${URL_API}` + `${this.rootEndpoint()}/calculate`,
      {
        referenceDate: refDate,
      }
    );
  }

  fetchLastReferenceFromIndicatorsScores() {
    return this._httpClient.get(`${URL_API}` + `${this.rootEndpoint()}/last-reference`);
  }
}
