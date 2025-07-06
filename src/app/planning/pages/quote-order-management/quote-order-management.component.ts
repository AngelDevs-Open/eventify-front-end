import {Component, inject, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {
  QuoteOrderCreateAndEditComponent
} from '../../components/quote-order-create-and-edit/quote-order-create-and-edit.component';
import {QuoteOrder} from '../../model/quote-order.entity';
import {ServiceItem} from '../../model/service-item.entity';
import {QuoteOrderService} from '../../services/quote-order.service';
import {ServiceItemService} from '../../services/service-item.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-quote-order-management',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatIcon,
    MatButton,
    DatePipe
  ],
  templateUrl: './quote-order-management.component.html',
  styleUrl: './quote-order-management.component.css'
})
export class QuoteOrderManagementComponent implements OnInit {

  protected displayedColumns: string[] = ['quoteId','title','eventType','eventDate','totalPrice','state','actions'];

  protected dataSource:QuoteOrder[] = [];

  protected editMode = false;

  protected quoteOrderData!: QuoteOrder;
  protected eventDate !:Date;
  protected serviceItemsForQuoteOrder: ServiceItem[]=[];

  private serviceItemService: ServiceItemService = inject(ServiceItemService);
  private quoteService: QuoteOrderService = inject(QuoteOrderService);

  constructor(private router:Router){
    this.editMode = false;
    this.quoteOrderData = new QuoteOrder({});
  }

  ngOnInit():void {
    this.getAllQuoteOrders();
  }

  private getAllQuoteOrders(): void {
    this.quoteService.getAllQuotesForOrganizer(1).subscribe((response: Array<QuoteOrder>) => {
      this.dataSource = response;
    })
  }

  protected goToQuoteOrder(){
    if(this.editMode){
      this.router.navigate(['/quotes/edit']);
    }else{
      this.router.navigate(['/quotes/new']);
    }
  }

  protected onEditMode(item: QuoteOrder){
    this.editMode = true;

    this.quoteOrderData= item;
    this.router.navigate(['/quotes',this.quoteOrderData.quoteId,'edit']);
  }

  protected compareServices(services: ServiceItem[]){

    for (let service1 of this.serviceItemsForQuoteOrder){
      let encontrado = false;
      for (let service2 of services) {
        if(service1.id === service2.id){
          this.updateServiceItem(service1);
          console.log(`Update: ${service1.id}`);
          encontrado = true;
          break;
        }
      }
      if(!encontrado){
        console.log(`Eliminar: ${service1.id}`);
        this.deleteServiceItem(service1.quoteOrderId,service1.id)
      }
    }

    for(let service2 of services){
      let encontrado = false;
      for (let service1 of this.serviceItemsForQuoteOrder) {
        if(service2.id === service1.id){
          encontrado = true;
          break;
        }
      }
      if(!encontrado){
        this.createServiceItem(service2);
        console.log(`Create: ${service2.id}`);
      }
    }
  }

  private resetEditState():void{
    this.quoteOrderData = new QuoteOrder({});
    this.editMode = false;
  }

  protected onQuoteOrderAddRequested(item:QuoteOrder){
    this.quoteOrderData = item;
    this.createQuoteOrder();
    this.resetEditState();
  }

  protected onQuoteOrderUpdateRequested(item:QuoteOrder){
    this.quoteOrderData = item;
    this.updateQuoteOrder();
    this.resetEditState()
  }

  protected onServiceItemsAddRequested(items:ServiceItem[]){
    this.serviceItemsForQuoteOrder = items;
    console.log(this.serviceItemsForQuoteOrder)
    this.serviceItemsForQuoteOrder.forEach(item => {
      this.createServiceItem(item);
    })
    this.resetEditState();
  }

  protected onServiceItemsUpdateRequested(items:ServiceItem[]){
    this.serviceItemService.getByQuoteId(this.quoteOrderData.quoteId).subscribe((response: Array<ServiceItem>)=>{
      console.log('Id: ',this.quoteOrderData.quoteId);
      this.serviceItemsForQuoteOrder = response;
      console.log(this.serviceItemsForQuoteOrder);
    });
    this.compareServices(items);
    this.resetEditState();
  }

  onDeleteQuoteOrder(quote:QuoteOrder){
    this.deleteQuoteOrder(quote.quoteId);
    this.serviceItemService.getByQuoteId(quote.quoteId).subscribe((response: Array<ServiceItem>)=>{
      let serviceItems:ServiceItem[] = response;
      console.log(serviceItems);
      serviceItems.forEach(item => {
        this.deleteServiceItem(quote.quoteId,item.id);
      });
    });
    this.resetEditState();
  }


  private createQuoteOrder(){
    this.quoteService.create(this.quoteOrderData).subscribe((response:QuoteOrder)=>{
      this.dataSource=[...this.dataSource,response];
    })
  }

  private updateQuoteOrder(){
    this.quoteService.update(this.quoteOrderData.quoteId,this.quoteOrderData).subscribe((response:QuoteOrder)=>{
      console.log('Quote Order updated successfully');
    })
  }

  private deleteServiceItem(quoteId:string,serviceItemId:string){
    this.serviceItemService.deleteServiceItemByQuoteId(quoteId,serviceItemId).subscribe(()=>{
      console.log('service deleted successfully');
    })
  }

  private deleteQuoteOrder(id:string){
    this.quoteService.delete(id).subscribe(()=>{
      this.dataSource=this.dataSource.filter((quote:QuoteOrder) => quote.quoteId !== id);
    })
  }

  private createServiceItem(item:ServiceItem){
    this.serviceItemService.create(item).subscribe((response:ServiceItem)=>{
      console.log('Service item',response);
    })
  }

  private updateServiceItem(item:ServiceItem){
    this.serviceItemService.update(item.id,item).subscribe((response:ServiceItem)=>{
      console.log('Service item updated',response);
    })
  }

}
