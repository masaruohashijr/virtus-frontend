import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_API } from "src/app/common/service-constants";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";
import { BaseService } from "../common/base.service";
import { Observable } from "rxjs/internal/Observable";

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

  getDescription(
    id: number,
    objectType: string
  ): Observable<{ description: string }> {
    const queryParams = new HttpParams()
      .set("id", id.toString())
      .set("objectType", objectType);

    return this._httpClient.get<{ description: string }>(
      URL_API + this.rootEndpoint() + "/description",
      { params: queryParams }
    );
  }

  getAnalysis(
    objectType: string,
    entityId: number,
    cycleId: number,
    pillarId: number,
    componentId: number,
    planId: number,
    gradeTypeId: number,
    elementId: number,
    itemId: number
  ): Observable<{ analysis: string }> {
    const queryParams = new HttpParams()
      .set("objectType", objectType)
      .set("entityId", entityId)
      .set("cycleId", cycleId !== undefined ? cycleId.toString() : "0")
      .set("pillarId", pillarId !== undefined ? pillarId.toString() : "0")
      .set("componentId", componentId !== undefined ? componentId.toString() : "0")
      .set("planId", planId !== undefined ? planId.toString() : "0")
      .set("gradeTypeId", gradeTypeId !== undefined ? gradeTypeId.toString() : "0")
      .set("elementId", elementId !== undefined ? elementId.toString() : "0")
      .set("itemId", itemId !== undefined ? itemId.toString() : "0")
      ;

    return this._httpClient.get<{ analysis: string }>(
      URL_API + this.rootEndpoint() + "/analysis",
      { params: queryParams }
    );
  }

  updateAnalysis(payload: { 
    entidadeId: any; 
    cicloId: any; 
    pilarId: any; 
    componenteId: any; 
    planoId: any; 
    tipoNotaId: any; 
    elementoId: any; 
    itemId: any; 
    analise: any }, 
    objectType: any) {
    return this._httpClient.put(
      URL_API + this.rootEndpoint() + "/updateAnalysis",
      payload,{ params: { objectType } }
    );
  }
}
