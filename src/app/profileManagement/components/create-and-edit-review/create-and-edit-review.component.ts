import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Review } from '../../model/review.entity';

export type ReviewDialogMode = 'create' | 'edit' | 'view';

export interface ReviewDialogData {
  review: Partial<Review>;
  mode: ReviewDialogMode;
}

@Component({
  selector: 'app-create-and-edit-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-and-edit-review.component.html',
  styleUrls: ['./create-and-edit-review.component.css']
})
export class CreateAndEditReviewComponent implements OnInit {
  reviewForm: FormGroup;
  mode: ReviewDialogMode;

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Review';
      case 'edit':
        return 'Edit Review';
      case 'view':
        return 'Review Details';
      default:
        return 'Review';
    }
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateAndEditReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ReviewDialogData,
  ) {
    this.mode = dialogData.mode;

    this.reviewForm = this.fb.group({
      reviewer: [dialogData.review.reviewer || '', Validators.required],
      rating: [dialogData.review.rating || 1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [dialogData.review.comment || ''],
      profileId: [dialogData.review.profileId],
      id: [dialogData.review.id],
      date: [dialogData.review.date || new Date().toISOString()],
    });

    if (this.isViewMode) {
      this.reviewForm.disable();
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.dialogRef.close(this.reviewForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
