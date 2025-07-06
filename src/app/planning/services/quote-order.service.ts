import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {QuoteOrder} from '../model/quote-order.entity';
import {environment} from '../../../environments/environment';
import {catchError, Observable, retry} from 'rxjs';


const quotesEndpointPath = environment.quotesEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class QuoteOrderService extends BaseService<QuoteOrder>{

  constructor() {
    super();
    this.resourceEndpoint=quotesEndpointPath;
  }

  public getAllQuotesForOrganizer(organizerId:number): Observable<Array<QuoteOrder>> {
    return this.http.get<Array<QuoteOrder>>(`${this.serverBaseUrl}/organizers/${organizerId}${this.resourceEndpoint}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  public createQuote(resource:any): Observable<QuoteOrder> {
    console.log("New Resource: ", resource);
    return this.http.post<QuoteOrder>(`${this.serverBaseUrl}/quotes`,JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public UpdateQuote(quoteId:string, resource:any): Observable<QuoteOrder> {
    return this.http.put<QuoteOrder>(`${this.serverBaseUrl}/quotes/${quoteId}`,JSON.stringify(resource), this.httpOptions);
  }
}
