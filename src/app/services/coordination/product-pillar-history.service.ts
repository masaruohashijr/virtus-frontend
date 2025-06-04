import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";
import { ProductPillarHistoryDTO } from "src/app/domain/dto/product-pillar-history.dto";
import { BaseService } from "../common/base.service";

@Injectable({
  providedIn: "root",
})
export class ProductPillarHistoryService extends BaseService<ProductPillarHistoryDTO> {

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/product-pillar-history";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getHistory(
    entidadeId: number,
    cicloId: number,
    pilarId: number
  ): Observable<ProductPillarHistoryDTO[]> {
    let queryParams = new HttpParams();

    if (entidadeId != null)
      queryParams = queryParams.append("entidadeId", entidadeId.toString());
    if (cicloId != null)
      queryParams = queryParams.append("cicloId", cicloId.toString());
    if (pilarId != null)
      queryParams = queryParams.append("pilarId", pilarId.toString());
    const url = `${URL_API}${this.rootEndpoint()}/list`;
    return this.getHttpClient().get<ProductPillarHistoryDTO[]>(
      url,
      { params: queryParams }
    );
  }
}
