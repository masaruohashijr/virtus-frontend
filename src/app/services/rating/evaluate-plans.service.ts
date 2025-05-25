import { Injectable } from "@angular/core";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { BaseService } from "../common/base.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { URL_API } from "src/app/common/service-constants";
import { EvaluatePlansTreeDTO } from "src/app/domain/dto/evaluate-plans-tree-dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";

@Injectable({
  providedIn: "root",
})
export class EvaluatePlansService extends BaseService<EntityVirtusDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/evaluate-plans";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  listAll(filter: string) {
    let queryParams = new HttpParams();
    if (filter) queryParams = queryParams.append("filter", filter);
    return this.getHttpClient().get<EntityVirtusDTO[]>(
      `${URL_API}${this.rootEndpoint()}/list`,
      { params: queryParams }
    );
  }

  getEvaluatePlansTreeByEntityAndCycleId(entityId: number, cycleId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("entityId", entityId);
    queryParams = queryParams.append("cycleId", cycleId);
    return this._httpClient.get<EvaluatePlansTreeNode[]>(
      URL_API + this.rootEndpoint() + "/by-entity-and-cycle-id",
      { params: queryParams }
    );
  }

  salvarNotaElemento(payload: {
    entidadeId: number;
    cicloId: number;
    pilarId: number;
    planoId: number;
    componenteId: number;
    tipoNotaId: number;
    elementoId: number;
    nota: number;
    notaAnterior: number;
    motivacao: string;
  }) {
    return this._httpClient.put(
      URL_API + this.rootEndpoint()+"/updateElementGrade",
      payload
    );
  }
}
