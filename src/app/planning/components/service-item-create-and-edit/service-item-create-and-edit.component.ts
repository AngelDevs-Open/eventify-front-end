import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
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
  serviceFormDisabled: boolean = true;
  id!:string;
  description!: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;

  title!:string;

  @ViewChild('serviceItemForm',{static:false}) protected serviceItemForm !: NgForm;

  constructor(private cdr: ChangeDetectorRef,@Optional() public dialogRef?: MatDialogRef<ServiceItemCreateAndEditComponent>, @Inject(MAT_DIALOG_DATA) public data?:any
  ) {
    super();
    this.serviceItem= new ServiceItem({});

    if (this.data) {
      this.id = this.data.id;
      this.description = this.data.description;
      this.quantity = this.data.quantity;
      this.unitPrice = this.data.unitPrice;
      this.totalPrice = this.data.totalPrice;
      this.editMode = data.editMode??false;
      this.title = this.data.title;
    }
    console.log(this.editMode)
    console.log('Constructor editMode:', this.editMode);

    setTimeout(() => {
      console.log('AFTER 500ms editMode:', this.editMode);
    }, 500);
  }

  ngOnInit(): void {

    console.log("Data: ", this.data);
    this.editMode = this.data?.editMode??false;
    console.log('Edit Mode: ', this.editMode);
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
      if(this.editMode){
        this.dialogRef?.close({id: this.id, description: this.description, quantity: this.quantity, unitPrice: this.unitPrice, totalPrice: this.totalPrice});
      }else{
        this.dialogRef?.close({description: this.description, quantity: this.quantity, unitPrice: this.unitPrice, totalPrice: this.totalPrice});
      }

    }else{
      console.error('Invalid form data');
    }
  }

  protected onCancel(){

  }

}
