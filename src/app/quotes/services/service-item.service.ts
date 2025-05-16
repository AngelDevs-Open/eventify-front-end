import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {ServiceItem} from '../model/service-item.entity';
import {catchError, Observable, retry} from 'rxjs';

const servicesEndpointPath = '/services';

@Injectable({
  providedIn: 'root'
})
export class ServiceItemService extends BaseService<ServiceItem>{

  constructor() {
    super();
    this.resourceEndpoint = servicesEndpointPath;
  }

  getByQuoteId(quoteId: string): Observable<Array<ServiceItem>> {
    return this.http.get<Array<ServiceItem>>(`${this.resourcePath()}?quoteOrderId=${quoteId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
