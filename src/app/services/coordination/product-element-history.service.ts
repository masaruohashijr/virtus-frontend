import { ProductElementHistoryDTO } from "src/app/domain/dto/product-element-history.dto";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";
import { BaseService } from "../common/base.service";

@Injectable({
  providedIn: "root",
})
export class ProductElementHistoryService extends BaseService<ProductElementHistoryDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/product-element-history";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getHistory(
    entidadeId: number,
    cicloId: number,
    pilarId: number,
    componenteId: number,
    planoId: number,
    elementoId: number
  ): Observable<ProductElementHistoryDTO[]> {
    const params = new HttpParams()
      .set("entidadeId", entidadeId.toString())
      .set("cicloId", cicloId.toString())
      .set("pilarId", pilarId.toString())
      .set("componenteId", componenteId.toString())
      .set("planoId", planoId.toString())
      .set("elementoId", elementoId.toString());

    return this._httpClient.get<ProductElementHistoryDTO[]>(
      URL_API + `${this.rootEndpoint()}/list`,
      { params }
    );
  }
}
