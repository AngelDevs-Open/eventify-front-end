import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ServiceItem} from '../../model/service-item.entity';
import {FormsModule, NgForm} from '@angular/forms';
import {BaseFormComponent} from '../../../shared/components/base-form.component';

@Component({
  selector: 'app-service-item-create-and-edit',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    FormsModule
  ],
  templateUrl: './service-item-create-and-edit.component.html',
  styleUrl: './service-item-create-and-edit.component.css'
})
export class ServiceItemCreateAndEditComponent extends BaseFormComponent {
  @Input() serviceItem !: ServiceItem;
  @Input() editMode: boolean = false;
  @Input() quoteOrderId!: string;
  @Input() serviceFormDisabled: boolean = true;

  @Output() protected serviceItemAddRequested = new EventEmitter<ServiceItem>();
  @Output() protected serviceItemUpdateRequested = new EventEmitter<ServiceItem>();
  @Output() protected cancelRequested = new EventEmitter<void>();

  @ViewChild('serviceItemForm',{static:false}) protected serviceItemForm !: NgForm;

  constructor() {
    super();
    this.serviceItem= new ServiceItem({});
  }

  private resetEditState(){
      this.serviceItem = new ServiceItem({});
      this.editMode = false;
      this.serviceFormDisabled=true
  }

  private isValid = ()=>this.serviceItemForm.valid;

  private isEditMode = ():boolean =>this.editMode;

  protected updateTotalPrice(): void {
    const { quantity, unitPrice } = this.serviceItem;
    this.serviceItem.totalPrice = (quantity??0) * (unitPrice??0);
  }

  protected onSubmit(){
    if(this.isValid()){
      this.serviceItem.quoteOrderId = this.quoteOrderId;
      let emitter= this.isEditMode()?this.serviceItemUpdateRequested:this.serviceItemAddRequested;
      emitter.emit(this.serviceItem);
      console.log(this.serviceItem);
      this.serviceItem = new ServiceItem({ quoteOrderId: this.quoteOrderId });
      this.resetEditState();
    }else{
      console.error('Invalid form data');
    }
  }

  protected onCancel(){
    this.cancelRequested.emit();
    this.resetEditState();
  }

}
