import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";
import { BaseService } from "../common/base.service";
import { ProductPlanHistoryDTO } from "src/app/domain/dto/product-plan-history.dto";

@Injectable({
  providedIn: "root",
})
export class ProductPlanHistoryService extends BaseService<ProductPlanHistoryDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  // Sobrescreve o rootEndpoint para definir o endpoint específico de histórico de plano
  override rootEndpoint(): string {
    return "/product-plan-history";
  }

  // Retorna o HttpClient para uso nas requisições
  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  // Função para obter o histórico do plano com base nos IDs fornecidos
  getHistory(
    entidadeId: number,
    cicloId: number,
    pilarId: number,
    componenteId: number,
    planoId: number
  ): Observable<ProductPlanHistoryDTO[]> {
    let queryParams = new HttpParams();

    // Adiciona os parâmetros à URL de consulta
    if (entidadeId != null) {
      queryParams = queryParams.append("entidadeId", entidadeId.toString());
    }
    if (cicloId != null) {
      queryParams = queryParams.append("cicloId", cicloId.toString());
    }
    if (pilarId != null) {
      queryParams = queryParams.append("pilarId", pilarId.toString());
    }
    if (componenteId != null) {
      queryParams = queryParams.append("componenteId", componenteId.toString());
    }
    if (planoId != null) {
      queryParams = queryParams.append("planoId", planoId.toString());
    }

    // Monta a URL com o endpoint e os parâmetros da consulta
    const url = `${URL_API}${this.rootEndpoint()}/list`;

    // Faz a requisição GET e retorna um Observable do tipo ProductPlanHistoryDTO[]
    return this.getHttpClient().get<ProductPlanHistoryDTO[]>(url, { params: queryParams });
  }
}
