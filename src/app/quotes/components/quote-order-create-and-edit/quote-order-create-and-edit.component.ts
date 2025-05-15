import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
    FormsModule,
    ServiceItemCreateAndEditComponent
  ],
  providers: [provideNativeDateAdapter(),DatePipe],
  templateUrl: './quote-order-create-and-edit.component.html',
  styleUrl: './quote-order-create-and-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class QuoteOrderCreateAndEditComponent extends BaseFormComponent{
  //Options for select evenType
  eventTypeOptions=[
    {label:'Wedding', value:'Wedding'},
    {label:'Conference', value:'Conference'},
    {label:'Quinceanera', value:'Quinceanera'},
    {label:'Graduation', value:'Graduation'}
  ];
  protected displayedColumns: string[] = ['id', 'description', 'quantity', 'unitPrice','totalPrice'];
  /** Array of services recieved from serviceItem Form*/


  //Total Price Information for Quote Order
  protected totalPrice: number = 0;

  protected serviceFormDisabled:boolean = true;

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

  constructor(private datePipe:DatePipe) {
    super()
    this.quoteOrder=new QuoteOrder({});

  }

  protected activeServiceForm(){
    this.serviceFormDisabled=false;
  }

  private resetEditState(){
    this.quoteOrder = new QuoteOrder({});
    this.eventDate=new Date();
    this.serviceItems=[];
    this.editMode = false;
    this.serviceFormDisabled=true;
  }

  private isValid=()=>this.quoteForm.valid;

  protected isEditMode= ()=> this.editMode;

  protected onSubmit(){
    if(this.isValid()){
      this.quoteOrder.totalPrice = this.getTotalPriceInfo();

      this.quoteOrder.eventDate= this.datePipe.transform(this.eventDate,'MM/dd/yyyy');
      this.quoteOrder.state = 'Pending'
      let emitterQuote = this.isEditMode()?this.quoteOrderUpdateRequested:this.quoteOrderAddRequested;
      let emitterServices = this.isEditMode()?this.serviceItemsUpdateRequested:this.serviceItemsAddRequested;
      emitterQuote.emit(this.quoteOrder);
      emitterServices.emit(this.serviceItems);
      console.log(this.quoteOrder);
    }else{
      console.error('Invalid form data');
    }
  }

  protected onCancel(){
    this.cancelRequested.emit();
    this.resetEditState();
  }

  protected onServiceItemAddRequested(item: ServiceItem){
    this.serviceItems = [...this.serviceItems, item];
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
