import {v4 as uuidv4} from 'uuid';

export class ServiceItem {
  id:string;
  description:string;
  quantity:number | null;
  unitPrice:number | null;
  totalPrice:number;
  quoteOrderId:string;

  constructor({id='',description='', quantity=null,unitPrice=null,quoteOrderId=''}){
    this.id = id?id:uuidv4();
    this.description=description;
    this.quantity=quantity;
    this.unitPrice=unitPrice;
    this.totalPrice=(quantity??0)* (unitPrice??0);
    this.quoteOrderId=quoteOrderId;
  }
}
