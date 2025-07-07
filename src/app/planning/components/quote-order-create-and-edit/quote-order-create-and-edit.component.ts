import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatTableModule} from '@angular/material/table';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {QuoteOrder} from '../../model/quote-order.entity';
import {FormsModule, NgForm} from '@angular/forms';
import {
  ServiceItemCreateAndEditComponent
} from '../service-item-create-and-edit/service-item-create-and-edit.component';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {ServiceItem} from '../../model/service-item.entity';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {QuoteOrderService} from '../../services/quote-order.service';
import {MatDialog} from '@angular/material/dialog';
import {ServiceItemService} from '../../services/service-item.service';





@Component({
  selector: 'app-quote-order-create-and-edit',
  imports: [
    MatButton,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MatTableModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatIcon,
    MatSelect,
    MatOption,
    FormsModule
  ],
  providers: [provideNativeDateAdapter(),DatePipe],
  templateUrl: './quote-order-create-and-edit.component.html',
  styleUrl: './quote-order-create-and-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class QuoteOrderCreateAndEditComponent extends BaseFormComponent implements OnInit{
  //Options for select evenType
  eventTypeOptions=[
    {label:'Wedding', value:'WEDDING'},
    {label:'Conference', value:'CONFERENCE'},
    {label:'Birthday', value:'BIRTHDAY'},
    {label:'Graduation', value:'GRADUATION'}
  ];
  protected displayedColumns: string[] = ['description', 'quantity', 'unitPrice','totalPrice','actions'];
  /** Array of services recieved from serviceItem Form*/


    //Total Price Information for Quote Order
  protected totalPrice: number = 0;

  protected serviceFormDisabled:boolean = true;

  //EditMode for Service Form Create and Edit
  protected editModeService:boolean=false;
  protected serviceData!:ServiceItem;

  protected quoteService:QuoteOrderService = inject(QuoteOrderService);
  protected serviceItemService: ServiceItemService = inject(ServiceItemService);

  private originalServiceItems:ServiceItem[] = [];

  @Input() quoteOrder !:QuoteOrder;
  @Input() editMode: boolean = false;
  @Input() eventDate: Date = new Date();
  @Input() serviceItems:ServiceItem[] = [];

  @Output() protected quoteOrderAddRequested = new EventEmitter<QuoteOrder>();
  @Output() protected serviceItemsAddRequested = new EventEmitter<ServiceItem[]>();
  @Output() protected serviceItemsUpdateRequested = new EventEmitter<ServiceItem[]>();
  @Output() protected quoteOrderUpdateRequested = new EventEmitter<QuoteOrder>();
  @Output() protected cancelRequested = new EventEmitter<void>();

  @ViewChild('quoteForm',{static:false}) protected quoteForm !: NgForm;

  constructor(private router:Router, private route:ActivatedRoute,private datePipe:DatePipe, private dialog: MatDialog,   private cdr: ChangeDetectorRef) {
    super()
    this.quoteOrder=new QuoteOrder({});

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.editMode = data['editMode'] === true;
    });

    this.route.paramMap.subscribe(params => {
      const quoteId = params.get('quoteId');
      if(quoteId){
        this.quoteService.getById(quoteId).subscribe((quoteOrder:QuoteOrder)=>{
          this.quoteOrder = quoteOrder;
          this.eventDate = new Date(this.quoteOrder.eventDate ?? new Date());
          this.serviceItemService.getByQuoteId(quoteId).subscribe((items:ServiceItem[])=>{
            this.serviceItems = items;
            this.originalServiceItems = JSON.parse(JSON.stringify(this.serviceItems));
            console.log("Service Items of Quote: ", this.serviceItems);
            this.cdr.markForCheck();
          })
          this.cdr.markForCheck();
          console.log("Quote Order from route",this.quoteOrder);
        })
      }
    })
  }

  onUpdateServiceItems(){
    // 1. Nuevos serviceItems (no tienen id)
    const newItems = this.serviceItems.filter(item => !item.id);

    // 2. Eliminados (estaban antes y ya no están)
    const deletedItems = this.originalServiceItems.filter(
      orig => !this.serviceItems.some(item => item.id === orig.id)
    );

    // 3. Actualizados (existen en ambos y han cambiado)
    const updatedItems = this.serviceItems.filter(item => {
      const orig = this.originalServiceItems.find(o => o.id === item.id);
      return orig && JSON.stringify(orig) !== JSON.stringify(item);
    });

    // Crear nuevos
    newItems.forEach(item => {
      const serviceResource = {
        description:item.description,
        quantity:item.quantity?? 1,
        unitPrice:item.unitPrice,
        totalPrice:item.totalPrice,
        quoteId: this.quoteOrder.quoteId
      };
      this.serviceItemService.createServiceItem(this.quoteOrder.quoteId, serviceResource).subscribe();
    });

    // Actualizar existentes
    updatedItems.forEach(item => {
      let serviceResource = {
        description:item.description,
        quantity:item.quantity?? 1,
        unitPrice:item.unitPrice,
        totalPrice:item.totalPrice
      }
      this.serviceItemService.updateServiceItem(this.quoteOrder.quoteId,serviceResource,item.id).subscribe();
    });

    // Eliminar los borrados
    deletedItems.forEach(item => {
      this.serviceItemService.deleteServiceItemByQuoteId(this.quoteOrder.quoteId,item.id).subscribe();
    });
  }

  openServiceItemDialog():void{
    const dialogRef = this.dialog.open(ServiceItemCreateAndEditComponent,{width:'900px', data:{
        description:"", quantity:0, unitPrice:0, totalPrice:0, editMode:false, title:"Create Service"
      }});

    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        const serviceItem:ServiceItem=new ServiceItem({...result});
        this.serviceItems = [...this.serviceItems, serviceItem];
        this.cdr.markForCheck();
        console.log(this.serviceItems);
      }
    })
  }

  updateServiceItem(item:any){
    const dialogRef = this.dialog.open(ServiceItemCreateAndEditComponent,{width:'900px', data:{
        id:item.id,description:item.description, quantity:item.quantity, unitPrice:item.unitPrice, totalPrice:item.totalPrice,editMode:true, title:'Edit Service'}});
    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        const idx = this.serviceItems.findIndex(o => o.id === item.id);
        console.log(idx);
        console.log(result);
        if (idx > -1) {
          this.serviceItems[idx] = new ServiceItem({...item,...result});
          this.serviceItems = [...this.serviceItems];
          this.cdr.markForCheck();
        }
      }
    })
  }


  protected isEditModeService(item:ServiceItem){
    this.editModeService=true;
    this.serviceData=item;
  }

  private resetEditState(){
    this.quoteOrder = new QuoteOrder({});
    this.eventDate=new Date();
    this.serviceItems=[];
    this.editMode = false;
    this.serviceFormDisabled=true;
  }

  private resetEditStateService(){
    this.serviceData=new ServiceItem({});
    this.editModeService=false
  }

  private isValid=()=>this.quoteForm.valid;

  protected isEditMode= ()=> this.editMode;


  protected onCreateQuoteOrder(){
    if(this.isValid()){
      let quoteResource = {
        title:this.quoteOrder.title,
        eventType:this.quoteOrder.eventType,
        guestQuantity:this.quoteOrder.guestQuantity,
        location:this.quoteOrder.location,
        totalPrice:this.getTotalPriceInfo(),
        state:"PENDING",
        eventDate:this.eventDate?.toISOString(),
        organizerId: 1,
        hostId:2};

      console.log(quoteResource);

      this.quoteService.createQuote(quoteResource).subscribe((response:QuoteOrder)=>{
        console.log(response);
        this.serviceItems.forEach(item=>{
          const serviceResource = {
            description:item.description,
            quantity:item.quantity?? 1,
            unitPrice:item.unitPrice,
            totalPrice:item.totalPrice,
            quoteId: response.quoteId
          };
          console.log(serviceResource);
          this.serviceItemService.createServiceItem(response.quoteId, serviceResource).subscribe((response:ServiceItem)=>{
            console.log(response);
          })
        })
        this.router.navigate(['/quotes']);
      });
    }
  }

  onUpdateQuoteOrder(){
    let updateResource={
      title:this.quoteOrder.title,
      eventType: this.quoteOrder.eventType,
      guestQuantity:this.quoteOrder.guestQuantity,
      location:this.quoteOrder.location,
      totalPrice:this.getTotalPriceInfo(),
      eventDate:this.eventDate?.toISOString()
    }

    this.quoteService.UpdateQuote(this.quoteOrder.quoteId, updateResource).subscribe((response:QuoteOrder)=>{
      console.log("Quote updated successfully");
      this.onUpdateServiceItems();
    });
    this.router.navigate(['/quotes']);
  }

  protected onSubmit(){
    if(this.isValid()){
      if(this.editMode){
        this.onUpdateQuoteOrder();
      }else{
        this.onCreateQuoteOrder();
      }
    }else{
      console.error('Invalid form data');
    }
  }

  protected onCancel(){
    //this.cancelRequested.emit();
    this.resetEditState();
    this.router.navigate(['/quotes']);
  }

  protected onServiceItemAddRequested(item: ServiceItem){
    this.serviceItems = [...this.serviceItems, item];
    console.log(this.serviceItems);
  }

  protected onServiceItemUpdateRequested(item:ServiceItem){
    let index = this.serviceItems.findIndex(service => item.id !== service.id);
    this.serviceItems[index]=item;
    this.resetEditStateService();
  }

  protected onServiceItemDelete(id:string){
    this.serviceItems =this.serviceItems.filter(service=>service.id !== id);

    console.log(this.serviceItems);
  }

  protected getTotalPriceInfo(){
    return this.serviceItems?this.serviceItems.map(item => item.totalPrice).reduce((total,item)=> total+item,0):0;
  }

  protected getIGVPrice(){
    return this.getTotalPriceInfo() * 0.18;
  }

  protected getSubTotalPrice(){
    return  this.getTotalPriceInfo() - this.getIGVPrice();
  }
}

