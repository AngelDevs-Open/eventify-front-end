import {v4 as uuidv4} from 'uuid';

export class ServiceItem {
  id:string;
  description:string;
  quantity:number;
  unitPrice:number;
  totalPrice:number;
  quoteOrderId:string;

  constructor({id='',description='', quantity=0,unitPrice=0,quoteOrderId=''}){
    this.id = id;
    this.description=description;
    this.quantity=quantity;
    this.unitPrice=unitPrice;
    this.totalPrice=(quantity??0)* (unitPrice??0);
    this.quoteOrderId=quoteOrderId;
  }
}
