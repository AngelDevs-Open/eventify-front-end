import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {QuoteOrder} from '../model/quote-order.entity';
import {environment} from '../../../environments/environment';


const quotesEndpointPath = environment.quotesEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class QuoteOrderService extends BaseService<QuoteOrder>{

  constructor() {
    super();
    this.resourceEndpoint=quotesEndpointPath;
  }
}
