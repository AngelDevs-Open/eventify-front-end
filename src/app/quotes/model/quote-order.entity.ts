import {v4 as uuidv4} from 'uuid';

export class QuoteOrder {
  id:string;
  title:string;
  eventType:string;
  guestQuantity:number;
  location:string;
  totalPrice:number;
  state:string;
  eventDate:string | null;

  constructor({id='',title='',eventType='',guestQuantity=0,location='',totalPrice=0,state='',eventDate=''}){
    this.id=id?id:uuidv4();
    this.title=title;
    this.eventType=eventType;
    this.guestQuantity=guestQuantity;
    this.location=location;
    this.totalPrice=totalPrice;
    this.state=state;
    this.eventDate= eventDate;
  }
}
