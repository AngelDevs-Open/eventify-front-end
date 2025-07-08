import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EventEntity } from '../../model/event.entity';
import { EventStatus, EventStatusEnum } from '../../model/event-status.entity';

export interface EventDialogData {
  event?: EventEntity;
  userId: string;
  isEditMode: boolean;
}

@Component({
  selector: 'app-event-create-and-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  templateUrl: './event-create-and-edit.component.html',
  styleUrls: ['./event-create-and-edit.component.css']
})
export class EventCreateAndEditComponent implements OnInit {
  eventForm!: FormGroup;
  statusOptions = Object.values(EventStatusEnum);
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EventCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
    private fb: FormBuilder
  ) {
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode && this.data.event) {
      this.populateForm(this.data.event);
    }
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      customerName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      status: [EventStatusEnum.TO_BE_CONFIRMED, [Validators.required]]
    });
  }

  private populateForm(event: EventEntity): void {
    this.eventForm.patchValue({
      title: event.title,
      date: event.date,
      customerName: event.customerName,
      location: event.location,
      status: event.status.value
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    const formValues = this.eventForm.value;

    // Convertir la fecha al formato correcto
    let eventDate: Date;

    if (formValues.date instanceof Date) {
      eventDate = formValues.date;
    } else {
      try {
        eventDate = new Date(formValues.date);
      } catch (e) {
        console.error('Error converting form date to Date object:', e);
        return;
      }
    }

    console.log('Form date value:', formValues.date);
    console.log('Converted date object:', eventDate);
    console.log('ISO date string:', eventDate.toISOString());

    if (this.isEditMode && this.data.event) {
      // Update existing event
      const updatedEvent = new EventEntity({
        ...this.data.event,
        title: formValues.title,
        date: eventDate,
        customerName: formValues.customerName,
        location: formValues.location,
        status: new EventStatus(formValues.status)
      });

      console.log('Sending updated event to dialog result:', updatedEvent);
      this.dialogRef.close(updatedEvent);
    } else {
      // Create new event
      const newEvent = EventEntity.createNew(
        formValues.title,
        eventDate,
        formValues.customerName,
        formValues.location,
        this.data.userId
      );

      // Set status if different from default
      if (formValues.status !== EventStatusEnum.TO_BE_CONFIRMED) {
        newEvent.changeStatus(formValues.status);
      }

      console.log('Sending new event to dialog result:', newEvent);
      this.dialogRef.close(newEvent);
    }
  }
}
