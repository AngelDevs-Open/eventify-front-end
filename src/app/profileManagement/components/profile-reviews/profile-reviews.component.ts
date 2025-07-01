import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Review } from '../../model/review.entity';
import { ReviewService } from '../../services/review.service';
import {
  CreateAndEditReviewComponent,
  ReviewDialogMode
} from '../create-and-edit-review/create-and-edit-review.component';

@Component({
  selector: 'app-profile-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-reviews.component.html',
  styleUrl: './profile-reviews.component.css'
})
export class ProfileReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  profileId = 1;

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  createReview(): void {
    this.openReviewDialog();
  }

  editReview(review: Review): void {
    this.openReviewDialog(review);
  }

  private openReviewDialog(review?: Review): void {
    const mode: ReviewDialogMode = review ? 'edit' : 'create';
    const dialogRef = this.dialog.open(CreateAndEditReviewComponent, {
      width: '500px',
      data: {
        review: review ? { ...review } : { profileId: this.profileId },
        mode,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const request$ = result.id
          ? this.reviewService.updateReview(result)
          : this.reviewService.createReview(result);

        request$.subscribe({
          next: () => {
            this.snackBar.open('Review saved', 'Close', { duration: 3000 });
            this.loadReviews();
          },
          error: err => {
            console.error('Error saving review', err);
            this.snackBar.open('Error saving review', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  private loadReviews(): void {
    this.reviewService.getReviewsByProfile(this.profileId).subscribe({
      next: reviews => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading reviews', err);
        this.loading = false;
      }
    });
  }
}
