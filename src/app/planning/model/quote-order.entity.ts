import {v4 as uuidv4} from 'uuid';

export class QuoteOrder {
  quoteId:string;
  title:string;
  eventType:string;
  guestQuantity:number;
  location:string;
  totalPrice:number;
  state:string;
  eventDate:string | null;
  organizerId:number;
  hostId:number;

  constructor({quoteId='',title='',eventType='',guestQuantity=0,location='',totalPrice=0,state='',eventDate='', organizerId=1, hostId=2}){
    this.quoteId=quoteId;
    this.title=title;
    this.eventType=eventType;
    this.guestQuantity=guestQuantity;
    this.location=location;
    this.totalPrice=totalPrice;
    this.state=state;
    this.eventDate= eventDate;
    this.organizerId=organizerId;
    this.hostId=hostId;
  }
}
