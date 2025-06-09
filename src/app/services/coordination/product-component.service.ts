import { Injectable } from "@angular/core";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { URL_API } from "src/app/common/service-constants";
import { BaseService } from "../common/base.service";

@Injectable({
  providedIn: "root",
})
export class ProductComponentService extends BaseService<ProductComponentDTO> {
  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return "/product-component";
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }

  getHistory(
    entidadeId: number,
    cicloId: number,
    pilarId: number,
    componenteId: number
  ): Observable<ProductComponentDTO[]> {
    const params = new HttpParams()
      .set("entidadeId", entidadeId.toString())
      .set("cicloId", cicloId.toString())
      .set("pilarId", pilarId.toString())
      .set("componenteId", componenteId.toString());

    return this._httpClient.get<ProductComponentDTO[]>(
      URL_API + `${this.rootEndpoint()}/list`,
      { params }
    );
  }

  replaceAuditor(
    product: ProductComponentDTO,
    userId: AuditorDTO,
    justifyText: any
  ) {
    throw new Error("Method not implemented.");
  }
}
