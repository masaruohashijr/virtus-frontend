import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AutomaticScoreDTO } from "src/app/domain/dto/automatic-score.dto";
import { BaseService } from "../common/base.service";

@Injectable({
  providedIn: "root",
})
export class AutomaticScoresService extends BaseService<AutomaticScoreDTO> {

  constructor(private _httpClient: HttpClient) {
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
}
