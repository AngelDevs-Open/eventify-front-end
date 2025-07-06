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
    return this.http.get<Array<ServiceItem>>(`${this.serverBaseUrl}/quotes/${quoteId}/service-items`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  createServiceItem(quoteId:string, serviceItemResource:any):Observable<ServiceItem> {

    return this.http.post<ServiceItem>(`${this.serverBaseUrl}/quotes/${quoteId}/service-items`,JSON.stringify(serviceItemResource),this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteServiceItemByQuoteId(quoteId:string,serviceItemId:string):Observable<any> {
    return this.http.delete(`${this.serverBaseUrl}/quotes/${quoteId}/service-items/${serviceItemId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateServiceItem(quoteId:string, resource:any, serviceItemId:string):Observable<ServiceItem> {
    return this.http.put<ServiceItem>(`${this.serverBaseUrl}/quotes/${quoteId}/service-items/${serviceItemId}`,JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
