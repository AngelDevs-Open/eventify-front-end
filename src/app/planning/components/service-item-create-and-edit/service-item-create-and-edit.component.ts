import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ServiceItem} from '../../model/service-item.entity';
import {FormsModule, NgForm} from '@angular/forms';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-service-item-create-and-edit',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose
  ],
  templateUrl: './service-item-create-and-edit.component.html',
  styleUrl: './service-item-create-and-edit.component.css'
})
export class ServiceItemCreateAndEditComponent extends BaseFormComponent implements OnInit{
  serviceItem:ServiceItem;
  editMode: boolean=false;
  quoteOrderId!: string;
  serviceFormDisabled: boolean = true;

  description!: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;

  title!:string;


  //@Output() protected serviceItemAddRequested = new EventEmitter<ServiceItem>();
  //@Output() protected serviceItemUpdateRequested = new EventEmitter<ServiceItem>();
  //@Output() protected cancelRequested = new EventEmitter<void>();

  @ViewChild('serviceItemForm',{static:false}) protected serviceItemForm !: NgForm;

  constructor(private cdr: ChangeDetectorRef,@Optional() public dialogRef?: MatDialogRef<ServiceItemCreateAndEditComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data?:any
  ) {
    super();
    this.serviceItem= new ServiceItem({});

    if (this.data) {
      this.description = this.data.description;
      this.quantity = this.data.quantity;
      this.unitPrice = this.data.unitPrice;
      this.totalPrice = this.data.totalPrice;
      this.editMode = this.data.editMode;
      this.title = this.data.title;
    }
    console.log(this.editMode)
  }

  ngOnInit(): void {

    if (!this.serviceItem) {
      this.serviceItem = new ServiceItem({});
    }
  }


  private resetEditState(){
    this.serviceItem = new ServiceItem({});
    this.editMode = false;
    this.serviceFormDisabled=true
  }

  private isValid = ()=>this.serviceItemForm.valid;


  protected updateTotalPrice(): void {
    const quantity = this.quantity;
    const unitPrice = this.unitPrice;
    this.totalPrice = (quantity??0) * (unitPrice??0);
  }

  protected onSubmit(){
    if(this.isValid()){
      /*this.serviceItem.quoteOrderId = this.quoteOrderId;
      let emitter= this.isEditMode()?this.serviceItemUpdateRequested:this.serviceItemAddRequested;
      emitter.emit(this.serviceItem);
      console.log(this.serviceItem);
      this.serviceItem = new ServiceItem({ quoteOrderId: this.quoteOrderId });*/
      this.dialogRef?.close({description: this.description, quantity: this.quantity, unitPrice: this.unitPrice, totalPrice: this.totalPrice});
      this.resetEditState();
    }else{
      console.error('Invalid form data');
    }
  }

  protected onCancel(){
    //this.cancelRequested.emit();
    this.resetEditState();
  }

}
