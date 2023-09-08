import { Injectable } from '@angular/core';
import { WorkflowDTO } from 'src/app/domain/dto/workflow.dto';
import { BaseService } from '../common/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsService extends BaseService<WorkflowDTO>{

  constructor(private _httpClient: HttpClient) {
    super();
  }

  override rootEndpoint(): string {
    return '/workflows';
  }

  override getHttpClient(): HttpClient {
    return this._httpClient;
  }
}
