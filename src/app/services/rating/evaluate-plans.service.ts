import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_API } from "src/app/common/service-constants";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";
import { BaseService } from "../common/base.service";


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
      URL_API + this.rootEndpoint() + "/updateElementGrade",
      payload
    );
  }

salvarPesoElemento(payload: {
    entidadeId: number;
    cicloId: number;
    pilarId: number;
    planoId: number;
    componenteId: number;
    tipoNotaId: number;
    elementoId: number;
    peso: number;
    pesoAnterior: number;
    motivacao: string;
  }) {
    return this._httpClient.put(
      URL_API + this.rootEndpoint() + "/updateElementWeight",
      payload
    );
  }
  salvarPesoPilar(payload: {
    entidadeId: any;
    cicloId: any;
    pilarId: any;
    supervisorId: any;
    novoPeso: any;
    pesoAnterior: any;
    motivacao: any;
  }) {
    return this._httpClient.put(
      URL_API + this.rootEndpoint() + "/updatePillarWeight",
      payload
    );
  }

}
