import { Injectable } from '@angular/core';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { BaseService } from '../common/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_API } from 'src/app/common/service-constants';
import { EvaluatePlansTreeDTO } from 'src/app/domain/dto/evaluate-plans-tree-dto';
import { EvaluatePlansTreeNode } from 'src/app/domain/dto/eveluate-plans-tree-node';

@Injectable({
  providedIn: 'root'
})
export class EvaluatePlansService extends BaseService<EntityVirtusDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/evaluate-plans';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  listAll() {
    return this.getHttpClient().get<EntityVirtusDTO[]>(`${URL_API}${this.rootEndpoint()}/list`);
  }

  getEvaluatePlansTreeByEntityAndCycleId(entityId: number, cycleId: number) {
      let queryParams = new HttpParams();
      queryParams = queryParams.append("entityId", entityId);
      queryParams = queryParams.append("cycleId", cycleId);
      return this._httpClient.get<EvaluatePlansTreeNode[]>(
        URL_API + this.rootEndpoint() + "/by-entity-and-cycle-id",
        { params: queryParams });
    }

}
